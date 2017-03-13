// tslint:disable-next-line:max-file-line-count
import { bind, cloneDeep, defaults, each, keys, uniqueId } from 'lodash';
import { AsyncSubject, BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { CompositeDisposable, IDisposable } from 'ts-disposables';
import { QueueProcessor } from '../helpers/QueueProcessor';

import { CommandContext } from '../contexts/CommandContext';
import { RequestContext } from '../contexts/RequestContext';
import { ResponseContext } from '../contexts/ResponseContext';
import { IDriverOptions, IOmnisharpClientStatus, IReactiveClientOptions, IReactiveDriver } from '../enums';
import { DriverState, Runtime } from '../enums';
import { event, getInternalValue, reference, request, response, setEventOrResponse } from '../helpers/decorators';
import { getPreconditions } from '../helpers/preconditions';
import { isDeferredCommand, isNormalCommand, isPriorityCommand } from '../helpers/prioritization';
import * as OmniSharp from '../omnisharp-server';
import { createObservable } from '../operators/create';
import { ensureClientOptions } from '../options';

export class ReactiveClient implements IReactiveDriver, IDisposable {
    private _driver: IReactiveDriver;
    private _requestStream = new Subject<RequestContext<any>>();
    private _responseStream = new Subject<ResponseContext<any, any>>();
    private _responseStreams = new Map<string, Subject<ResponseContext<any, any>>>();
    private _statusStream: Observable<IOmnisharpClientStatus>;
    private _errorStream = new Subject<CommandContext<any>>();
    private _uniqueId = uniqueId('client');
    private _lowestIndexValue = 0;
    private _observe: ReactiveClientEvents;
    private _disposable = new CompositeDisposable();
    private _options: IReactiveClientOptions & IDriverOptions;
    private _fixups: ((action: string, request: any, options?: OmniSharp.RequestOptions) => void)[] = [];

    private _eventsStream = new Subject<OmniSharp.Stdio.Protocol.EventPacket>();
    private _events = this._eventsStream.asObservable();

    private _stateStream = new BehaviorSubject<DriverState>(DriverState.Disconnected);
    private _state = this._stateStream.asObservable();

    private _queue: QueueProcessor<Observable<ResponseContext<any, any>>>;

    public get uniqueId() { return this._uniqueId; }

    public get id() { return this._driver.id; }
    public get serverPath() { return this._driver.serverPath; }
    public get projectPath() { return this._driver.projectPath; }
    public get runtime(): Runtime { return this._driver.runtime; }
    public get events(): Observable<OmniSharp.Stdio.Protocol.EventPacket> { return this._events; }
    public get currentState() { return this._stateStream.getValue(); }
    public get state(): Observable<DriverState> { return this._state; }
    public get outstandingRequests() { return this._currentRequests.size; }
    private _currentRequests = new Set<RequestContext<any>>();

    public get status(): Observable<IOmnisharpClientStatus> { return this._statusStream; }
    public get requests(): Observable<RequestContext<any>> { return <Observable<RequestContext<any>>><any>this._requestStream; }
    public get responses(): Observable<ResponseContext<any, any>> { return this._responseStream; }
    public get errors(): Observable<CommandContext<any>> { return <Observable<CommandContext<any>>><any>this._errorStream; }
    public get observe(): ReactiveClientEvents { return this._observe; }



    public constructor(_options: Partial<IReactiveClientOptions>) {
        _options.driver = _options.driver || ((options: IDriverOptions) => {
            // tslint:disable-next-line:no-require-imports
            const item = require('../drivers/StdioDriver');
            const driverFactory = item[keys(item)[0]];
            return new driverFactory(this._options);
        });

        this._options = <any>defaults(_options, <Partial<IDriverOptions>>{
            projectPath: '',
            onState: bind(this._stateStream.next, this._stateStream),
            onEvent: bind(this._eventsStream.next, this._eventsStream),
            onCommand: packet => {
                const response = new ResponseContext(new RequestContext(this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body);
                this._getResponseStream(packet.Command).next(response);
            },
        });

        ensureClientOptions(this._options);
        this._queue = new QueueProcessor<Observable<ResponseContext<any, any>>>(this._options.concurrency, bind(this._handleResult, this));

        this._resetDriver();

        const getStatusValues = () => <IOmnisharpClientStatus>({
            state: this._driver.currentState,
            outgoingRequests: this.outstandingRequests,
            hasOutgoingRequests: this.outstandingRequests > 0,
        });

        const status = Observable.merge(
            <Observable<any>><any>this._requestStream,
            <Observable<any>><any>this._responseStream);

        this._statusStream = status
            .map(getStatusValues)
            .distinctUntilChanged()
            .debounceTime(100)
            .share();

        this._observe = new ReactiveClientEvents(this);

        if (this._options.debug) {
            this._disposable.add(this._responseStream.subscribe(context => {
                // log our complete response time
                this._eventsStream.next({
                    Event: 'log',
                    Body: {
                        Message: `/${context.command}  ${context.responseTime}ms (round trip)`,
                        LogLevel: 'INFORMATION',
                    },
                    Seq: -1,
                    Type: 'log',
                });
            }));
        }
    }

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

    public dispose() {
        if (this._disposable.isDisposed) {
            return;
        }
        this.disconnect();
        this._disposable.dispose();
    }

    public log(message: string, logLevel?: string) {
        // log our complete response time
        this._eventsStream.next({
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

    public request<TRequest, TResponse>(action: string, request?: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse> {
        const conditions = getPreconditions(action);
        if (conditions) { each(conditions, x => x(request)); }

        if (!options) {
            options = <OmniSharp.RequestOptions>{};
        }
        // Handle disconnected requests
        if (this.currentState !== DriverState.Connected && this.currentState !== DriverState.Error) {
            return this.state
                .filter(z => z === DriverState.Connected)
                .take(1)
                .switchMap(z => {
                    return this.request<TRequest, TResponse>(action, request, options);
                });
        }

        const context = new RequestContext(this._uniqueId, action, request!, options);
        this._currentRequests.add(context);
        this._requestStream.next(context);
        const response = this._queue.enqueue(context);
        // By default the request will only be made if the response is subscribed to...
        // This is a breaking change for clients, potentially a very big one, so this subscribe
        // avoids the problem for the moment
        response.subscribe();

        return <Observable<TResponse>><any>response;
    }

    public registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void) {
        this._fixups.push(func);
    }

    private _handleResult(context: RequestContext<any>): Observable<ResponseContext<any, any>> {
        const responseStream = this._getResponseStream(context.command);
        return this._driver.request<any, any>(context.command, context.request)
            .do(data => {
                responseStream.next(new ResponseContext(context, data));
            }, error => {
                this._errorStream.next(new CommandContext(context.command, error));
                responseStream.next(new ResponseContext(context, null, true));
                this._currentRequests.delete(context);
            }, () => {
                this._currentRequests.delete(context);
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

    private _getResponseStream(key: string) {
        key = key.toLowerCase();
        if (!this._responseStreams.has(key)) {
            const subject = new Subject<ResponseContext<any, any>>();
            subject.subscribe({
                next: bind(this._responseStream.next, this._responseStream),
            });
            this._responseStreams.set(key, subject);
            return subject;
        }

        return this._responseStreams.get(key)!;
    }

    private _fixup<TRequest>(action: string, request: TRequest, options?: OmniSharp.RequestOptions) {
        each(this._fixups, f => f(action, request, options));
    }
}

// tslint:disable-next-line:interface-name no-empty-interface
export interface ReactiveClient extends OmniSharp.Api.V2 { }

// tslint:disable-next-line:max-classes-per-file
export class ReactiveClientEvents {
    public constructor(
        private _client: ReactiveClient) { }

    public get uniqueId() { return this._client.uniqueId; }

    public listen(key: string): Observable<any> {
        const value = getInternalValue(this, key);
        if (!value) {
            return setEventOrResponse(this, key);
        }
        return value;
    }
}

// tslint:disable-next-line:interface-name no-empty-interface
export interface ReactiveClientEvents extends OmniSharp.Events.V2, OmniSharp.Events {
    /*readonly*/ events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    /*readonly*/ commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    /*readonly*/ state: Observable<DriverState>;
    /*readonly*/ status: Observable<IOmnisharpClientStatus>;
    /*readonly*/ requests: Observable<RequestContext<any>>;
    /*readonly*/ responses: Observable<ResponseContext<any, any>>;
    /*readonly*/ errors: Observable<CommandContext<any>>;
}

reference(ReactiveClientEvents.prototype, 'events', 'events');
reference(ReactiveClientEvents.prototype, 'commands', 'commands');
reference(ReactiveClientEvents.prototype, 'state', 'state');
reference(ReactiveClientEvents.prototype, 'status', 'status');
reference(ReactiveClientEvents.prototype, 'requests', 'requests');
reference(ReactiveClientEvents.prototype, 'responses', 'responses');
reference(ReactiveClientEvents.prototype, 'errors', 'errors');


// <#GENERATED />
request(ReactiveClient.prototype, 'getteststartinfo');
request(ReactiveClient.prototype, 'runtest');
request(ReactiveClient.prototype, 'autocomplete');
request(ReactiveClient.prototype, 'changebuffer');
request(ReactiveClient.prototype, 'codecheck');
request(ReactiveClient.prototype, 'codeformat');
request(ReactiveClient.prototype, 'diagnostics');
request(ReactiveClient.prototype, 'close');
request(ReactiveClient.prototype, 'open');
request(ReactiveClient.prototype, 'filesChanged');
request(ReactiveClient.prototype, 'findimplementations');
request(ReactiveClient.prototype, 'findsymbols');
request(ReactiveClient.prototype, 'findusages');
request(ReactiveClient.prototype, 'fixusings');
request(ReactiveClient.prototype, 'formatAfterKeystroke');
request(ReactiveClient.prototype, 'formatRange');
request(ReactiveClient.prototype, 'getcodeactions');
request(ReactiveClient.prototype, 'gotodefinition');
request(ReactiveClient.prototype, 'gotofile');
request(ReactiveClient.prototype, 'gotoregion');
request(ReactiveClient.prototype, 'highlight');
request(ReactiveClient.prototype, 'currentfilemembersasflat');
request(ReactiveClient.prototype, 'currentfilemembersastree');
request(ReactiveClient.prototype, 'metadata');
request(ReactiveClient.prototype, 'navigatedown');
request(ReactiveClient.prototype, 'navigateup');
request(ReactiveClient.prototype, 'packagesearch');
request(ReactiveClient.prototype, 'packagesource');
request(ReactiveClient.prototype, 'packageversion');
request(ReactiveClient.prototype, 'rename');
request(ReactiveClient.prototype, 'runcodeaction');
request(ReactiveClient.prototype, 'signatureHelp');
request(ReactiveClient.prototype, 'gettestcontext');
request(ReactiveClient.prototype, 'typelookup');
request(ReactiveClient.prototype, 'updatebuffer');
request(ReactiveClient.prototype, 'project');
request(ReactiveClient.prototype, 'projects');
request(ReactiveClient.prototype, 'checkalivestatus');
request(ReactiveClient.prototype, 'checkreadystatus');
request(ReactiveClient.prototype, 'stopserver');
response(ReactiveClientEvents.prototype, 'getteststartinfo', '/v2/getteststartinfo');
response(ReactiveClientEvents.prototype, 'runtest', '/v2/runtest');
response(ReactiveClientEvents.prototype, 'autocomplete', '/autocomplete');
response(ReactiveClientEvents.prototype, 'changebuffer', '/changebuffer');
response(ReactiveClientEvents.prototype, 'codecheck', '/codecheck');
response(ReactiveClientEvents.prototype, 'codeformat', '/codeformat');
response(ReactiveClientEvents.prototype, 'diagnostics', '/diagnostics');
response(ReactiveClientEvents.prototype, 'close', '/close');
response(ReactiveClientEvents.prototype, 'open', '/open');
response(ReactiveClientEvents.prototype, 'filesChanged', '/filesChanged');
response(ReactiveClientEvents.prototype, 'findimplementations', '/findimplementations');
response(ReactiveClientEvents.prototype, 'findsymbols', '/findsymbols');
response(ReactiveClientEvents.prototype, 'findusages', '/findusages');
response(ReactiveClientEvents.prototype, 'fixusings', '/fixusings');
response(ReactiveClientEvents.prototype, 'formatAfterKeystroke', '/formatAfterKeystroke');
response(ReactiveClientEvents.prototype, 'formatRange', '/formatRange');
response(ReactiveClientEvents.prototype, 'getcodeactions', '/v2/getcodeactions');
response(ReactiveClientEvents.prototype, 'gotodefinition', '/gotodefinition');
response(ReactiveClientEvents.prototype, 'gotofile', '/gotofile');
response(ReactiveClientEvents.prototype, 'gotoregion', '/gotoregion');
response(ReactiveClientEvents.prototype, 'highlight', '/highlight');
response(ReactiveClientEvents.prototype, 'currentfilemembersasflat', '/currentfilemembersasflat');
response(ReactiveClientEvents.prototype, 'currentfilemembersastree', '/currentfilemembersastree');
response(ReactiveClientEvents.prototype, 'metadata', '/metadata');
response(ReactiveClientEvents.prototype, 'navigatedown', '/navigatedown');
response(ReactiveClientEvents.prototype, 'navigateup', '/navigateup');
response(ReactiveClientEvents.prototype, 'packagesearch', '/packagesearch');
response(ReactiveClientEvents.prototype, 'packagesource', '/packagesource');
response(ReactiveClientEvents.prototype, 'packageversion', '/packageversion');
response(ReactiveClientEvents.prototype, 'rename', '/rename');
response(ReactiveClientEvents.prototype, 'runcodeaction', '/v2/runcodeaction');
response(ReactiveClientEvents.prototype, 'signatureHelp', '/signatureHelp');
response(ReactiveClientEvents.prototype, 'gettestcontext', '/gettestcontext');
response(ReactiveClientEvents.prototype, 'typelookup', '/typelookup');
response(ReactiveClientEvents.prototype, 'updatebuffer', '/updatebuffer');
response(ReactiveClientEvents.prototype, 'project', '/project');
response(ReactiveClientEvents.prototype, 'projects', '/projects');
response(ReactiveClientEvents.prototype, 'checkalivestatus', '/checkalivestatus');
response(ReactiveClientEvents.prototype, 'checkreadystatus', '/checkreadystatus');
response(ReactiveClientEvents.prototype, 'stopserver', '/stopserver');
event(ReactiveClientEvents.prototype, 'projectAdded');
event(ReactiveClientEvents.prototype, 'projectChanged');
event(ReactiveClientEvents.prototype, 'projectRemoved');
event(ReactiveClientEvents.prototype, 'error');
event(ReactiveClientEvents.prototype, 'diagnostic');
event(ReactiveClientEvents.prototype, 'msBuildProjectDiagnostics');
event(ReactiveClientEvents.prototype, 'packageRestoreStarted');
event(ReactiveClientEvents.prototype, 'packageRestoreFinished');
event(ReactiveClientEvents.prototype, 'unresolvedDependencies');
