// tslint:disable-next-line:max-file-line-count
/* tslint:disable:no-any */
import { EventEmitter } from 'events';
import { bind, cloneDeep, defaults, each, isEqual, keys, uniqueId } from 'lodash';
import { CompositeDisposable, IDisposable } from 'ts-disposables';

import { CommandContext } from '../contexts/CommandContext';
import { RequestContext } from '../contexts/RequestContext';
import { ResponseContext } from '../contexts/ResponseContext';
import { IAsyncClientOptions, IAsyncDriver, IDriverOptions, IOmnisharpClientStatus } from '../enums';
import { DriverState, Runtime } from '../enums';
import { QueueProcessor } from '../helpers/QueueProcessor';
import { request } from '../helpers/decorators';
import { getPreconditions } from '../helpers/preconditions';
import * as OmniSharp from '../omnisharp-server';
import { ensureClientOptions } from '../options';
import * as AsyncEvents from './AsyncEvents';

/////
// NOT TESTED
// NOT READY! :)
/////

export class AsyncClient implements IAsyncDriver, IDisposable {
    private _lowestIndexValue = 0;
    private _emitter = new EventEmitter();
    private _queue: QueueProcessor<PromiseLike<ResponseContext<any, any>>>;

    private _driver: IAsyncDriver;
    private _uniqueId = uniqueId('client');
    private _disposable = new CompositeDisposable();
    private _currentRequests = new Set<RequestContext<any>>();
    private _currentState: DriverState = DriverState.Disconnected;
    private _options: IAsyncClientOptions & IDriverOptions;
    private _fixups: ((action: string, request: any, options?: OmniSharp.RequestOptions) => void)[] = [];

    public constructor(_options: Partial<IAsyncClientOptions> & { projectPath: string }) {
        _options.driver = _options.driver || ((options: IDriverOptions) => {
            // tslint:disable-next-line:no-require-imports
            const item = require('../drivers/StdioDriver');
            const driverFactory = item[keys(item)[0]];
            return new driverFactory(this._options);
        });

        this._options = <IAsyncClientOptions & IDriverOptions>defaults(_options, <IDriverOptions>{
            onState: state => {
                this._currentState = state;
                this._emitter.emit(AsyncEvents.state, state);
            },
            onEvent: event => {
                this._emitter.emit(AsyncEvents.event, event);
            },
            onCommand: packet => {
                const response = new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body);
                this._respondToRequest(packet.Command, response);
            },
        });

        ensureClientOptions(this._options);

        this._resetDriver();

        const getStatusValues = () => <IOmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this.outstandingRequests,
            hasOutgoingRequests: this.outstandingRequests > 0,
        });

        let lastStatus: IOmnisharpClientStatus = <any>{};
        const emitStatus = () => {
            const newStatus = getStatusValues();
            if (!isEqual(getStatusValues(), lastStatus)) {
                lastStatus = newStatus;
                this._emitter.emit(AsyncEvents.status, lastStatus);
            }
        };

        this._emitter.on(AsyncEvents.request, emitStatus);
        this._emitter.on(AsyncEvents.response, emitStatus);
        this._queue = new QueueProcessor<PromiseLike<ResponseContext<any, any>>>(this._options.concurrency, bind(this._handleResult, this));

        if (this._options.debug) {
            this._emitter.on(AsyncEvents.response, (context: ResponseContext<any, any>) => {
                this._emitter.emit(AsyncEvents.event, {
                    Event: 'log',
                    Body: {
                        Message: `/${context.command}  ${context.responseTime}ms (round trip)`,
                        LogLevel: 'INFORMATION',
                    },
                    Seq: -1,
                    Type: 'log',
                });
            });
        }
    }

    public log(message: string, logLevel?: string) {
        // log our complete response time
        this._emitter.emit(AsyncEvents.event, {
            Event: 'log',
            Body: {
                Message: message,
                LogLevel: logLevel ? logLevel.toUpperCase() : 'INFORMATION',
            },
            Seq: -1,
            Type: 'log',
        });
    }

    public connect() {
        // Currently connecting
        if (this.currentState >= DriverState.Downloading && this.currentState <= DriverState.Connected) {
            return;
        }
        // Bootstrap plugins here

        this._currentRequests.clear();
        this._driver.connect();
    }

    public disconnect() {
        this._driver.disconnect();
    }

    public request<TRequest, TResponse>(action: string, request: TRequest, options?: OmniSharp.RequestOptions): Promise<TResponse> {
        const conditions = getPreconditions(action);
        if (conditions) {
            each(conditions, x => x(request));
        }

        if (!options) {
            options = <OmniSharp.RequestOptions>{};
        }
        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            return new Promise<TResponse>((resolve, reject) => {
                const disposable = this.onState(state => {
                    if (state === DriverState.Connected) {
                        disposable.dispose();
                        this.request<TRequest, TResponse>(action, request, options)
                            .then(resolve, reject);
                    }
                });
            });
        }

        const context = new RequestContext(this._uniqueId, action, request, options);
        return new Promise<TResponse>((resolve, reject) => {
            this._queue.enqueue(context).then(response => resolve(response.response), reject);
        });
    }

    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
    }

    public get uniqueId() { return this._uniqueId; }
    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }
    public get runtime(): Runtime { return this._driver.runtime; }
    public get outstandingRequests() { return this._currentRequests.size; }
    public get currentState() { return this._currentState; }

    public getCurrentRequests() {
        const response: {
            command: string;
            sequence: string;
            silent: boolean;
            request: any;
            duration: number;
        }[] = [];

        this._currentRequests.forEach(request => {
            response.push({
                command: request.command,
                sequence: cloneDeep(request.sequence),
                request: request.request,
                silent: request.silent,
                duration: Date.now() - request.time.getTime(),
            });
        });

        return response;
    }

    public onEvent(callback: (event: OmniSharp.Stdio.Protocol.EventPacket) => void) {
        return this._listen(AsyncEvents.event, callback);
    }
    public onState(callback: (state: DriverState) => void) {
        return this._listen(AsyncEvents.state, callback);
    }

    public onStatus(callback: (status: IOmnisharpClientStatus) => void) {
        return this._listen(AsyncEvents.status, callback);
    }

    public onRequest(callback: (request: RequestContext<any>) => void) {
        return this._listen(AsyncEvents.request, callback);
    }

    public onResponse(callback: (response: ResponseContext<any, any>) => void) {
        return this._listen(AsyncEvents.response, callback);
    }

    public onError(callback: (event: OmniSharp.Stdio.Protocol.EventPacket) => void) {
        return this._listen(AsyncEvents.error, callback);
    }

    public dispose() {
        if (this._disposable.isDisposed) {
            return;
        }
        this.disconnect();
        this._disposable.dispose();
    }

    private _listen(event: string, callback: Function): IDisposable {
        this._emitter.addListener(AsyncEvents.event, callback);
        return { dispose: () => this._emitter.removeListener(AsyncEvents.event, callback) };
    }

    private _handleResult(context: RequestContext<any>, complete?: () => void): Promise<ResponseContext<any, any>> {
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn"t hit the server
        //      with multiple of these requests (as we slam the cpU)
        const result = this._driver.request<any, any>(context.command, context.request);

        const cmp = () => {
            this._currentRequests.delete(context);
            if (complete) {
                complete();
            }
        };

        return new Promise((resolve, reject) => {
            result
                .then(data => {
                    this._respondToRequest(context.command, new ResponseContext(context, data));
                    cmp();
                    resolve(data);
                }, error => {
                    this._emitter.emit(AsyncEvents.error, new CommandContext(context.command, error));
                    this._respondToRequest(context.command, new ResponseContext(context, null, true));
                    this._currentRequests.delete(context);
                    cmp();
                    reject(error);
                });
        });
    }

    private _resetDriver() {
        if (this._driver) {
            this._disposable.remove(this._driver);
            this._driver.dispose();
        }

        const { driver } = this._options;
        this._driver = driver(this._options);
        this._disposable.add(this._driver);

        return this._driver;
    }

    private _respondToRequest(key: string, response: ResponseContext<any, any>) {
        key = key.toLowerCase();
        this._emitter.emit(key, response);
        this._emitter.emit(AsyncEvents.response, response);
    }

    /* tslint:disable:no-unused-variable */
    private _fixup<TRequest>(action: string, request: TRequest, options?: OmniSharp.RequestOptions) {
        each(this._fixups, f => f(action, request, options));
    }
    /* tslint:enable:no-unused-variable */
}

// <#GENERATED />
request(AsyncClient.prototype, 'getteststartinfo');
request(AsyncClient.prototype, 'runtest');
request(AsyncClient.prototype, 'autocomplete');
request(AsyncClient.prototype, 'changebuffer');
request(AsyncClient.prototype, 'codecheck');
request(AsyncClient.prototype, 'codeformat');
request(AsyncClient.prototype, 'diagnostics');
request(AsyncClient.prototype, 'close');
request(AsyncClient.prototype, 'open');
request(AsyncClient.prototype, 'filesChanged');
request(AsyncClient.prototype, 'findimplementations');
request(AsyncClient.prototype, 'findsymbols');
request(AsyncClient.prototype, 'findusages');
request(AsyncClient.prototype, 'fixusings');
request(AsyncClient.prototype, 'formatAfterKeystroke');
request(AsyncClient.prototype, 'formatRange');
request(AsyncClient.prototype, 'getcodeactions');
request(AsyncClient.prototype, 'gotodefinition');
request(AsyncClient.prototype, 'gotofile');
request(AsyncClient.prototype, 'gotoregion');
request(AsyncClient.prototype, 'highlight');
request(AsyncClient.prototype, 'currentfilemembersasflat');
request(AsyncClient.prototype, 'currentfilemembersastree');
request(AsyncClient.prototype, 'metadata');
request(AsyncClient.prototype, 'navigatedown');
request(AsyncClient.prototype, 'navigateup');
request(AsyncClient.prototype, 'packagesearch');
request(AsyncClient.prototype, 'packagesource');
request(AsyncClient.prototype, 'packageversion');
request(AsyncClient.prototype, 'rename');
request(AsyncClient.prototype, 'runcodeaction');
request(AsyncClient.prototype, 'signatureHelp');
request(AsyncClient.prototype, 'gettestcontext');
request(AsyncClient.prototype, 'typelookup');
request(AsyncClient.prototype, 'updatebuffer');
request(AsyncClient.prototype, 'project');
request(AsyncClient.prototype, 'projects');
request(AsyncClient.prototype, 'checkalivestatus');
request(AsyncClient.prototype, 'checkreadystatus');
request(AsyncClient.prototype, 'stopserver');
