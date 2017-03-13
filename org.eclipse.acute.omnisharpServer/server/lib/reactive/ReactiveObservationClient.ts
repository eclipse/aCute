import { pull } from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { CompositeDisposable, Disposable, IDisposable } from 'ts-disposables';
import { CommandContext } from '../contexts/CommandContext';
import { RequestContext } from '../contexts/RequestContext';
import { ResponseContext } from '../contexts/ResponseContext';
import { DriverState, IOmnisharpClientStatus } from '../enums';
import { getInternalKey, makeObservable, setMergeOrAggregate } from '../helpers/decorators';
import * as OmniSharp from '../omnisharp-server';
import { ReactiveClient } from './ReactiveClient';

export class ReactiveObservationClient<TClient extends ReactiveClient> implements IDisposable {
    protected _disposable = new CompositeDisposable();
    protected _clientsSubject = new ReplaySubject<TClient[]>(1);
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
        return this._clientsSubject.switchMap(clients => Observable.merge<T>(...clients.map(selector))).share();
    };

    private next = () => this._clientsSubject.next(this.clients.slice());
}

makeObservable(ReactiveObservationClient.prototype, 'events', 'events');
makeObservable(ReactiveObservationClient.prototype, 'commands', 'commands');
makeObservable(ReactiveObservationClient.prototype, 'state', 'state');
makeObservable(ReactiveObservationClient.prototype, 'status', 'status');
makeObservable(ReactiveObservationClient.prototype, 'requests', 'requests');
makeObservable(ReactiveObservationClient.prototype, 'responses', 'responses');
makeObservable(ReactiveObservationClient.prototype, 'errors', 'errors');

// tslint:disable-next-line:interface-name
export interface ReactiveObservationClient<TClient extends ReactiveClient> extends OmniSharp.Events, OmniSharp.Events.V2 {
    /*readonly*/ events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    /*readonly*/ commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
    /*readonly*/ state: Observable<DriverState>;
    /*readonly*/ status: Observable<IOmnisharpClientStatus>;
    /*readonly*/ requests: Observable<RequestContext<any>>;
    /*readonly*/ responses: Observable<ResponseContext<any, any>>;
    /*readonly*/ errors: Observable<CommandContext<any>>;
}

// <#GENERATED />
makeObservable(ReactiveObservationClient.prototype, 'getteststartinfo', '/v2/getteststartinfo');
makeObservable(ReactiveObservationClient.prototype, 'runtest', '/v2/runtest');
makeObservable(ReactiveObservationClient.prototype, 'autocomplete', '/autocomplete');
makeObservable(ReactiveObservationClient.prototype, 'changebuffer', '/changebuffer');
makeObservable(ReactiveObservationClient.prototype, 'codecheck', '/codecheck');
makeObservable(ReactiveObservationClient.prototype, 'codeformat', '/codeformat');
makeObservable(ReactiveObservationClient.prototype, 'diagnostics', '/diagnostics');
makeObservable(ReactiveObservationClient.prototype, 'close', '/close');
makeObservable(ReactiveObservationClient.prototype, 'open', '/open');
makeObservable(ReactiveObservationClient.prototype, 'filesChanged', '/filesChanged');
makeObservable(ReactiveObservationClient.prototype, 'findimplementations', '/findimplementations');
makeObservable(ReactiveObservationClient.prototype, 'findsymbols', '/findsymbols');
makeObservable(ReactiveObservationClient.prototype, 'findusages', '/findusages');
makeObservable(ReactiveObservationClient.prototype, 'fixusings', '/fixusings');
makeObservable(ReactiveObservationClient.prototype, 'formatAfterKeystroke', '/formatAfterKeystroke');
makeObservable(ReactiveObservationClient.prototype, 'formatRange', '/formatRange');
makeObservable(ReactiveObservationClient.prototype, 'getcodeactions', '/v2/getcodeactions');
makeObservable(ReactiveObservationClient.prototype, 'gotodefinition', '/gotodefinition');
makeObservable(ReactiveObservationClient.prototype, 'gotofile', '/gotofile');
makeObservable(ReactiveObservationClient.prototype, 'gotoregion', '/gotoregion');
makeObservable(ReactiveObservationClient.prototype, 'highlight', '/highlight');
makeObservable(ReactiveObservationClient.prototype, 'currentfilemembersasflat', '/currentfilemembersasflat');
makeObservable(ReactiveObservationClient.prototype, 'currentfilemembersastree', '/currentfilemembersastree');
makeObservable(ReactiveObservationClient.prototype, 'metadata', '/metadata');
makeObservable(ReactiveObservationClient.prototype, 'navigatedown', '/navigatedown');
makeObservable(ReactiveObservationClient.prototype, 'navigateup', '/navigateup');
makeObservable(ReactiveObservationClient.prototype, 'packagesearch', '/packagesearch');
makeObservable(ReactiveObservationClient.prototype, 'packagesource', '/packagesource');
makeObservable(ReactiveObservationClient.prototype, 'packageversion', '/packageversion');
makeObservable(ReactiveObservationClient.prototype, 'rename', '/rename');
makeObservable(ReactiveObservationClient.prototype, 'runcodeaction', '/v2/runcodeaction');
makeObservable(ReactiveObservationClient.prototype, 'signatureHelp', '/signatureHelp');
makeObservable(ReactiveObservationClient.prototype, 'gettestcontext', '/gettestcontext');
makeObservable(ReactiveObservationClient.prototype, 'typelookup', '/typelookup');
makeObservable(ReactiveObservationClient.prototype, 'updatebuffer', '/updatebuffer');
makeObservable(ReactiveObservationClient.prototype, 'project', '/project');
makeObservable(ReactiveObservationClient.prototype, 'projects', '/projects');
makeObservable(ReactiveObservationClient.prototype, 'checkalivestatus', '/checkalivestatus');
makeObservable(ReactiveObservationClient.prototype, 'checkreadystatus', '/checkreadystatus');
makeObservable(ReactiveObservationClient.prototype, 'stopserver', '/stopserver');
makeObservable(ReactiveObservationClient.prototype, 'projectAdded', 'projectAdded');
makeObservable(ReactiveObservationClient.prototype, 'projectChanged', 'projectChanged');
makeObservable(ReactiveObservationClient.prototype, 'projectRemoved', 'projectRemoved');
makeObservable(ReactiveObservationClient.prototype, 'error', 'error');
makeObservable(ReactiveObservationClient.prototype, 'diagnostic', 'diagnostic');
makeObservable(ReactiveObservationClient.prototype, 'msBuildProjectDiagnostics', 'msBuildProjectDiagnostics');
makeObservable(ReactiveObservationClient.prototype, 'packageRestoreStarted', 'packageRestoreStarted');
makeObservable(ReactiveObservationClient.prototype, 'packageRestoreFinished', 'packageRestoreFinished');
makeObservable(ReactiveObservationClient.prototype, 'unresolvedDependencies', 'unresolvedDependencies');
