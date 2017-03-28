"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var ts_disposables_1 = require("ts-disposables");
var decorators_1 = require("../helpers/decorators");
var ReactiveObservationClient = (function () {
    function ReactiveObservationClient(clients) {
        if (clients === void 0) { clients = []; }
        var _this = this;
        this.clients = clients;
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._clientsSubject = new rxjs_1.ReplaySubject(1);
        this._clientDisposable = new ts_disposables_1.CompositeDisposable();
        this.makeObservable = function (selector) {
            return _this._clientsSubject.switchMap(function (clients) { return rxjs_1.Observable.merge.apply(rxjs_1.Observable, clients.map(selector)); }).share();
        };
        this.next = function () { return _this._clientsSubject.next(_this.clients.slice()); };
        this.next();
        this._disposable.add(this._clientDisposable);
    }
    ReactiveObservationClient.prototype.dispose = function () {
        if (this._disposable.isDisposed) {
            return;
        }
        this._disposable.dispose();
    };
    ReactiveObservationClient.prototype.listenTo = function (selector) {
        return this.makeObservable(selector);
    };
    ReactiveObservationClient.prototype.listen = function (selector) {
        var key = decorators_1.getInternalKey(selector);
        var value = this[key];
        if (!value) {
            return decorators_1.setMergeOrAggregate(this, selector);
        }
        return value;
    };
    ReactiveObservationClient.prototype.add = function (client) {
        var _this = this;
        this.clients.push(client);
        this.next();
        var d = ts_disposables_1.Disposable.create(function () {
            lodash_1.pull(_this.clients, client);
            _this.next();
        });
        this._clientDisposable.add(d);
        return d;
    };
    return ReactiveObservationClient;
}());
exports.ReactiveObservationClient = ReactiveObservationClient;
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'events', 'events');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'commands', 'commands');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'state', 'state');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'status', 'status');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'requests', 'requests');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'responses', 'responses');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'errors', 'errors');
// <#GENERATED />
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'getteststartinfo', '/v2/getteststartinfo');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'runtest', '/v2/runtest');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'autocomplete', '/autocomplete');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'changebuffer', '/changebuffer');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'codecheck', '/codecheck');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'codeformat', '/codeformat');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'diagnostics', '/diagnostics');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'close', '/close');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'open', '/open');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'filesChanged', '/filesChanged');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'findimplementations', '/findimplementations');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'findsymbols', '/findsymbols');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'findusages', '/findusages');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'fixusings', '/fixusings');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'formatAfterKeystroke', '/formatAfterKeystroke');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'formatRange', '/formatRange');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'getcodeactions', '/v2/getcodeactions');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'gotodefinition', '/gotodefinition');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'gotofile', '/gotofile');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'gotoregion', '/gotoregion');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'highlight', '/highlight');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'currentfilemembersasflat', '/currentfilemembersasflat');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'currentfilemembersastree', '/currentfilemembersastree');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'metadata', '/metadata');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'navigatedown', '/navigatedown');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'navigateup', '/navigateup');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'packagesearch', '/packagesearch');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'packagesource', '/packagesource');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'packageversion', '/packageversion');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'rename', '/rename');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'runcodeaction', '/v2/runcodeaction');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'signatureHelp', '/signatureHelp');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'gettestcontext', '/gettestcontext');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'typelookup', '/typelookup');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'updatebuffer', '/updatebuffer');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'project', '/project');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'projects', '/projects');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'checkalivestatus', '/checkalivestatus');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'checkreadystatus', '/checkreadystatus');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'stopserver', '/stopserver');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'projectAdded', 'projectAdded');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'projectChanged', 'projectChanged');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'projectRemoved', 'projectRemoved');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'error', 'error');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'diagnostic', 'diagnostic');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'msBuildProjectDiagnostics', 'msBuildProjectDiagnostics');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'packageRestoreStarted', 'packageRestoreStarted');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'packageRestoreFinished', 'packageRestoreFinished');
decorators_1.makeObservable(ReactiveObservationClient.prototype, 'unresolvedDependencies', 'unresolvedDependencies');
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/reactive/ReactiveObservationClient.js.map