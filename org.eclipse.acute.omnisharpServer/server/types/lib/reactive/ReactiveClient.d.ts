import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { CommandContext } from '../contexts/CommandContext';
import { RequestContext } from '../contexts/RequestContext';
import { ResponseContext } from '../contexts/ResponseContext';
import { IOmnisharpClientStatus, IReactiveClientOptions, IReactiveDriver } from '../enums';
import { DriverState, Runtime } from '../enums';
import * as OmniSharp from '../omnisharp-server';
export declare class ReactiveClient implements IReactiveDriver, IDisposable {
    private _driver;
    private _requestStream;
    private _responseStream;
    private _responseStreams;
    private _statusStream;
    private _errorStream;
    private _uniqueId;
    private _lowestIndexValue;
    private _observe;
    private _disposable;
    private _options;
    private _fixups;
    private _eventsStream;
    private _events;
    private _stateStream;
    private _state;
    private _queue;
    readonly uniqueId: string;
    readonly id: string;
    readonly serverPath: string;
    readonly projectPath: string;
    readonly runtime: Runtime;
    readonly events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    readonly currentState: DriverState;
    readonly state: Observable<DriverState>;
    readonly outstandingRequests: number;
    private _currentRequests;
    readonly status: Observable<IOmnisharpClientStatus>;
    readonly requests: Observable<RequestContext<any>>;
    readonly responses: Observable<ResponseContext<any, any>>;
    readonly errors: Observable<CommandContext<any>>;
    readonly observe: ReactiveClientEvents;
    constructor(_options: Partial<IReactiveClientOptions>);
    getCurrentRequests(): {
        command: string;
        sequence: string;
        silent: boolean;
        request: any;
        duration: number;
    }[];
    dispose(): void;
    log(message: string, logLevel?: string): void;
    connect(): void;
    disconnect(): void;
    request<TRequest, TResponse>(action: string, request?: TRequest, options?: OmniSharp.RequestOptions): Observable<TResponse>;
    registerFixup(func: (action: string, request: any, options?: OmniSharp.RequestOptions) => void): void;
    private _handleResult(context);
    private _resetDriver();
    private _getResponseStream(key);
    private _fixup<TRequest>(action, request, options?);
}
export interface ReactiveClient extends OmniSharp.Api.V2 {
}
export declare class ReactiveClientEvents {
    private _client;
    constructor(_client: ReactiveClient);
    readonly uniqueId: string;
    listen(key: string): Observable<any>;
}
export interface ReactiveClientEvents extends OmniSharp.Events.V2, OmniSharp.Events {
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    status: Observable<IOmnisharpClientStatus>;
    requests: Observable<RequestContext<any>>;
    responses: Observable<ResponseContext<any, any>>;
    errors: Observable<CommandContext<any>>;
}
