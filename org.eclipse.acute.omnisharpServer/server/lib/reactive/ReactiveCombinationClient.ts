import { difference, each, keys, pull } from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { CompositeDisposable, Disposable, IDisposable } from 'ts-disposables';
import { DriverState, IOmnisharpClientStatus } from '../enums';
import { getInternalKey, makeObservable, setMergeOrAggregate } from '../helpers/decorators';
import * as OmniSharp from '../omnisharp-server';
import { ReactiveClient } from './ReactiveClient';

export class ReactiveCombinationClient<TClient extends ReactiveClient> implements IDisposable {
    protected _disposable = new CompositeDisposable();
    private _clientsSubject = new ReplaySubject<TClient[]>(1);
    private _clientDisposable = new CompositeDisposable();
    [index: string]: any;

    public constructor(private clients: TClient[] = []) {
        this.next();
        this._disposable.add(this._clientDisposable);
    }

    public dispose() {
        if (this._disposable.isDisposed) { return; }
        this._disposable.dispose();
    }

    public listenTo<T>(selector: (client: TClient) => Observable<T>) {
        return this.makeObservable(selector);
    }

    public listen<T>(selector: string) {
        const key = getInternalKey(selector);
        const value = this[key];
        if (!value) {
            return setMergeOrAggregate(this, selector);
        }
        return value;
    }

    public add(client: TClient) {
        this.clients.push(client);
        this.next();
        const d = Disposable.create(() => {
            pull(this.clients, client);
            this.next();
        });
        this._clientDisposable.add(d);
        return d;
    }

    protected makeObservable = <T>(selector: (client: TClient) => Observable<T>) => {
        // Caches the value, so that when the underlying clients change
        // we can start with the old value of the remaining clients
        const cache: { [key: string]: T } = {};

        /* tslint:disable:no-string-literal */
        return this._clientsSubject.switchMap(clients => {
            // clean up after ourselves.
            const removal = difference(keys(cache), clients.map(z => z.uniqueId));
            each(removal, z => delete cache[z]);

            return Observable.combineLatest(
                clients.map(z => selector(z).startWith(cache[z.uniqueId])),
                (...values: T[]) =>
                    values.map((value, index) => {
                        cache[clients[index].uniqueId] = value;

                        return { key: clients[index].uniqueId, value };
                    })
            );
        }).share();
        /* tslint:enable:no-string-literal */
    };

    private next = () => this._clientsSubject.next(this.clients.slice());
}

makeObservable(ReactiveCombinationClient.prototype, 'state', 'state');
makeObservable(ReactiveCombinationClient.prototype, 'status', 'status');

// tslint:disable-next-line:interface-name
export interface ReactiveCombinationClient<TClient extends ReactiveClient> extends OmniSharp.Aggregate.Events, OmniSharp.Events.Aggregate.V2 {
    /*readonly*/ state: Observable<OmniSharp.CombinationKey<DriverState>[]>;
    /*readonly*/ status: Observable<OmniSharp.CombinationKey<IOmnisharpClientStatus>[]>;
}

// <#GENERATED />
makeObservable(ReactiveCombinationClient.prototype, 'getteststartinfo', '/v2/getteststartinfo');
makeObservable(ReactiveCombinationClient.prototype, 'runtest', '/v2/runtest');
makeObservable(ReactiveCombinationClient.prototype, 'autocomplete', '/autocomplete');
makeObservable(ReactiveCombinationClient.prototype, 'changebuffer', '/changebuffer');
makeObservable(ReactiveCombinationClient.prototype, 'codecheck', '/codecheck');
makeObservable(ReactiveCombinationClient.prototype, 'codeformat', '/codeformat');
makeObservable(ReactiveCombinationClient.prototype, 'diagnostics', '/diagnostics');
makeObservable(ReactiveCombinationClient.prototype, 'close', '/close');
makeObservable(ReactiveCombinationClient.prototype, 'open', '/open');
makeObservable(ReactiveCombinationClient.prototype, 'filesChanged', '/filesChanged');
makeObservable(ReactiveCombinationClient.prototype, 'findimplementations', '/findimplementations');
makeObservable(ReactiveCombinationClient.prototype, 'findsymbols', '/findsymbols');
makeObservable(ReactiveCombinationClient.prototype, 'findusages', '/findusages');
makeObservable(ReactiveCombinationClient.prototype, 'fixusings', '/fixusings');
makeObservable(ReactiveCombinationClient.prototype, 'formatAfterKeystroke', '/formatAfterKeystroke');
makeObservable(ReactiveCombinationClient.prototype, 'formatRange', '/formatRange');
makeObservable(ReactiveCombinationClient.prototype, 'getcodeactions', '/v2/getcodeactions');
makeObservable(ReactiveCombinationClient.prototype, 'gotodefinition', '/gotodefinition');
makeObservable(ReactiveCombinationClient.prototype, 'gotofile', '/gotofile');
makeObservable(ReactiveCombinationClient.prototype, 'gotoregion', '/gotoregion');
makeObservable(ReactiveCombinationClient.prototype, 'highlight', '/highlight');
makeObservable(ReactiveCombinationClient.prototype, 'currentfilemembersasflat', '/currentfilemembersasflat');
makeObservable(ReactiveCombinationClient.prototype, 'currentfilemembersastree', '/currentfilemembersastree');
makeObservable(ReactiveCombinationClient.prototype, 'metadata', '/metadata');
makeObservable(ReactiveCombinationClient.prototype, 'navigatedown', '/navigatedown');
makeObservable(ReactiveCombinationClient.prototype, 'navigateup', '/navigateup');
makeObservable(ReactiveCombinationClient.prototype, 'packagesearch', '/packagesearch');
makeObservable(ReactiveCombinationClient.prototype, 'packagesource', '/packagesource');
makeObservable(ReactiveCombinationClient.prototype, 'packageversion', '/packageversion');
makeObservable(ReactiveCombinationClient.prototype, 'rename', '/rename');
makeObservable(ReactiveCombinationClient.prototype, 'runcodeaction', '/v2/runcodeaction');
makeObservable(ReactiveCombinationClient.prototype, 'signatureHelp', '/signatureHelp');
makeObservable(ReactiveCombinationClient.prototype, 'gettestcontext', '/gettestcontext');
makeObservable(ReactiveCombinationClient.prototype, 'typelookup', '/typelookup');
makeObservable(ReactiveCombinationClient.prototype, 'updatebuffer', '/updatebuffer');
makeObservable(ReactiveCombinationClient.prototype, 'project', '/project');
makeObservable(ReactiveCombinationClient.prototype, 'projects', '/projects');
makeObservable(ReactiveCombinationClient.prototype, 'checkalivestatus', '/checkalivestatus');
makeObservable(ReactiveCombinationClient.prototype, 'checkreadystatus', '/checkreadystatus');
makeObservable(ReactiveCombinationClient.prototype, 'stopserver', '/stopserver');
makeObservable(ReactiveCombinationClient.prototype, 'projectAdded', 'projectAdded');
makeObservable(ReactiveCombinationClient.prototype, 'projectChanged', 'projectChanged');
makeObservable(ReactiveCombinationClient.prototype, 'projectRemoved', 'projectRemoved');
makeObservable(ReactiveCombinationClient.prototype, 'error', 'error');
makeObservable(ReactiveCombinationClient.prototype, 'diagnostic', 'diagnostic');
makeObservable(ReactiveCombinationClient.prototype, 'msBuildProjectDiagnostics', 'msBuildProjectDiagnostics');
makeObservable(ReactiveCombinationClient.prototype, 'packageRestoreStarted', 'packageRestoreStarted');
makeObservable(ReactiveCombinationClient.prototype, 'packageRestoreFinished', 'packageRestoreFinished');
makeObservable(ReactiveCombinationClient.prototype, 'unresolvedDependencies', 'unresolvedDependencies');
