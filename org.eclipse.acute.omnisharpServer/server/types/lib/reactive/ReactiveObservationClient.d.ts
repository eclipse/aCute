import { Observable, ReplaySubject } from 'rxjs';
import { CompositeDisposable, Disposable, IDisposable } from 'ts-disposables';
import { CommandContext } from '../contexts/CommandContext';
import { RequestContext } from '../contexts/RequestContext';
import { ResponseContext } from '../contexts/ResponseContext';
import { DriverState, IOmnisharpClientStatus } from '../enums';
import * as OmniSharp from '../omnisharp-server';
import { ReactiveClient } from './ReactiveClient';
export declare class ReactiveObservationClient<TClient extends ReactiveClient> implements IDisposable {
    private clients;
    protected _disposable: CompositeDisposable;
    protected _clientsSubject: ReplaySubject<TClient[]>;
    private _clientDisposable;
    [index: string]: any;
    constructor(clients?: TClient[]);
    dispose(): void;
    listenTo<T>(selector: (client: TClient) => Observable<T>): Observable<T>;
    listen<T>(selector: string): any;
    add(client: TClient): Disposable;
    protected makeObservable: <T>(selector: (client: TClient) => Observable<T>) => Observable<T>;
    private next;
}
export interface ReactiveObservationClient<TClient extends ReactiveClient> extends OmniSharp.Events, OmniSharp.Events.V2 {
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    state: Observable<DriverState>;
    status: Observable<IOmnisharpClientStatus>;
    requests: Observable<RequestContext<any>>;
    responses: Observable<ResponseContext<any, any>>;
    errors: Observable<CommandContext<any>>;
}
