import { Observable } from 'rxjs';
import { CompositeDisposable, Disposable, IDisposable } from 'ts-disposables';
import { DriverState, IOmnisharpClientStatus } from '../enums';
import * as OmniSharp from '../omnisharp-server';
import { ReactiveClient } from './ReactiveClient';
export declare class ReactiveCombinationClient<TClient extends ReactiveClient> implements IDisposable {
    private clients;
    protected _disposable: CompositeDisposable;
    private _clientsSubject;
    private _clientDisposable;
    [index: string]: any;
    constructor(clients?: TClient[]);
    dispose(): void;
    listenTo<T>(selector: (client: TClient) => Observable<T>): Observable<{
        key: string;
        value: T;
    }[]>;
    listen<T>(selector: string): any;
    add(client: TClient): Disposable;
    protected makeObservable: <T>(selector: (client: TClient) => Observable<T>) => Observable<{
        key: string;
        value: T;
    }[]>;
    private next;
}
export interface ReactiveCombinationClient<TClient extends ReactiveClient> extends OmniSharp.Aggregate.Events, OmniSharp.Events.Aggregate.V2 {
    state: Observable<OmniSharp.CombinationKey<DriverState>[]>;
    status: Observable<OmniSharp.CombinationKey<IOmnisharpClientStatus>[]>;
}
