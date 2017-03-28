"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var ts_disposables_1 = require("ts-disposables");
var decorators_1 = require("../helpers/decorators");
var ReactiveCombinationClient = (function () {
    function ReactiveCombinationClient(clients) {
        if (clients === void 0) { clients = []; }
        var _this = this;
        this.clients = clients;
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._clientsSubject = new rxjs_1.ReplaySubject(1);
        this._clientDisposable = new ts_disposables_1.CompositeDisposable();
        this.makeObservable = function (selector) {
            // Caches the value, so that when the underlying clients change
            // we can start with the old value of the remaining clients
            var cache = {};
            /* tslint:disable:no-string-literal */
            return _this._clientsSubject.switchMap(function (clients) {
                // clean up after ourselves.
                var removal = lodash_1.difference(lodash_1.keys(cache), clients.map(function (z) { return z.uniqueId; }));
                lodash_1.each(removal, function (z) { return delete cache[z]; });
                return rxjs_1.Observable.combineLatest(clients.map(function (z) { return selector(z).startWith(cache[z.uniqueId]); }), function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    return values.map(function (value, index) {
                        cache[clients[index].uniqueId] = value;
                        return { key: clients[index].uniqueId, value: value };
                    });
                });
            }).share();
            /* tslint:enable:no-string-literal */
        };
        this.next = function () { return _this._clientsSubject.next(_this.clients.slice()); };
        this.next();
        this._disposable.add(this._clientDisposable);
    }
    ReactiveCombinationClient.prototype.dispose = function () {
        if (this._disposable.isDisposed) {
            return;
        }
        this._disposable.dispose();
    };
    ReactiveCombinationClient.prototype.listenTo = function (selector) {
        return this.makeObservable(selector);
    };
    ReactiveCombinationClient.prototype.listen = function (selector) {
        var key = decorators_1.getInternalKey(selector);
        var value = this[key];
        if (!value) {
            return decorators_1.setMergeOrAggregate(this, selector);
        }
        return value;
    };
    ReactiveCombinationClient.prototype.add = function (client) {
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
    return ReactiveCombinationClient;
}());
exports.ReactiveCombinationClient = ReactiveCombinationClient;
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'state', 'state');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'status', 'status');
// <#GENERATED />
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'getteststartinfo', '/v2/getteststartinfo');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'runtest', '/v2/runtest');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'autocomplete', '/autocomplete');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'changebuffer', '/changebuffer');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'codecheck', '/codecheck');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'codeformat', '/codeformat');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'diagnostics', '/diagnostics');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'close', '/close');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'open', '/open');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'filesChanged', '/filesChanged');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'findimplementations', '/findimplementations');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'findsymbols', '/findsymbols');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'findusages', '/findusages');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'fixusings', '/fixusings');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'formatAfterKeystroke', '/formatAfterKeystroke');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'formatRange', '/formatRange');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'getcodeactions', '/v2/getcodeactions');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'gotodefinition', '/gotodefinition');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'gotofile', '/gotofile');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'gotoregion', '/gotoregion');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'highlight', '/highlight');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'currentfilemembersasflat', '/currentfilemembersasflat');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'currentfilemembersastree', '/currentfilemembersastree');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'metadata', '/metadata');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'navigatedown', '/navigatedown');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'navigateup', '/navigateup');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'packagesearch', '/packagesearch');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'packagesource', '/packagesource');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'packageversion', '/packageversion');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'rename', '/rename');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'runcodeaction', '/v2/runcodeaction');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'signatureHelp', '/signatureHelp');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'gettestcontext', '/gettestcontext');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'typelookup', '/typelookup');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'updatebuffer', '/updatebuffer');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'project', '/project');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'projects', '/projects');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'checkalivestatus', '/checkalivestatus');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'checkreadystatus', '/checkreadystatus');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'stopserver', '/stopserver');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'projectAdded', 'projectAdded');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'projectChanged', 'projectChanged');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'projectRemoved', 'projectRemoved');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'error', 'error');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'diagnostic', 'diagnostic');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'msBuildProjectDiagnostics', 'msBuildProjectDiagnostics');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'packageRestoreStarted', 'packageRestoreStarted');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'packageRestoreFinished', 'packageRestoreFinished');
decorators_1.makeObservable(ReactiveCombinationClient.prototype, 'unresolvedDependencies', 'unresolvedDependencies');
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/reactive/ReactiveCombinationClient.js.map