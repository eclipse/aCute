"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var ts_disposables_1 = require("ts-disposables");
var QueueProcessor_1 = require("../helpers/QueueProcessor");
var CommandContext_1 = require("../contexts/CommandContext");
var RequestContext_1 = require("../contexts/RequestContext");
var ResponseContext_1 = require("../contexts/ResponseContext");
var enums_1 = require("../enums");
var decorators_1 = require("../helpers/decorators");
var preconditions_1 = require("../helpers/preconditions");
var options_1 = require("../options");
var ReactiveClient = (function () {
    function ReactiveClient(_options) {
        var _this = this;
        this._requestStream = new rxjs_1.Subject();
        this._responseStream = new rxjs_1.Subject();
        this._responseStreams = new Map();
        this._errorStream = new rxjs_1.Subject();
        this._uniqueId = lodash_1.uniqueId('client');
        this._lowestIndexValue = 0;
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._fixups = [];
        this._eventsStream = new rxjs_1.Subject();
        this._events = this._eventsStream.asObservable();
        this._stateStream = new rxjs_1.BehaviorSubject(enums_1.DriverState.Disconnected);
        this._state = this._stateStream.asObservable();
        this._currentRequests = new Set();
        _options.driver = _options.driver || (function (options) {
            // tslint:disable-next-line:no-require-imports
            var item = require('../drivers/StdioDriver');
            var driverFactory = item[lodash_1.keys(item)[0]];
            return new driverFactory(_this._options);
        });
        this._options = lodash_1.defaults(_options, {
            projectPath: '',
            onState: lodash_1.bind(this._stateStream.next, this._stateStream),
            onEvent: lodash_1.bind(this._eventsStream.next, this._eventsStream),
            onCommand: function (packet) {
                var response = new ResponseContext_1.ResponseContext(new RequestContext_1.RequestContext(_this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body);
                _this._getResponseStream(packet.Command).next(response);
            },
        });
        options_1.ensureClientOptions(this._options);
        this._queue = new QueueProcessor_1.QueueProcessor(this._options.concurrency, lodash_1.bind(this._handleResult, this));
        this._resetDriver();
        var getStatusValues = function () { return ({
            state: _this._driver.currentState,
            outgoingRequests: _this.outstandingRequests,
            hasOutgoingRequests: _this.outstandingRequests > 0,
        }); };
        var status = rxjs_1.Observable.merge(this._requestStream, this._responseStream);
        this._statusStream = status
            .map(getStatusValues)
            .distinctUntilChanged()
            .debounceTime(100)
            .share();
        this._observe = new ReactiveClientEvents(this);
        if (this._options.debug) {
            this._disposable.add(this._responseStream.subscribe(function (context) {
                // log our complete response time
                _this._eventsStream.next({
                    Event: 'log',
                    Body: {
                        Message: "/" + context.command + "  " + context.responseTime + "ms (round trip)",
                        LogLevel: 'INFORMATION',
                    },
                    Seq: -1,
                    Type: 'log',
                });
            }));
        }
    }
    Object.defineProperty(ReactiveClient.prototype, "uniqueId", {
        get: function () { return this._uniqueId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "id", {
        get: function () { return this._driver.id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "serverPath", {
        get: function () { return this._driver.serverPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "projectPath", {
        get: function () { return this._driver.projectPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "runtime", {
        get: function () { return this._driver.runtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "events", {
        get: function () { return this._events; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "currentState", {
        get: function () { return this._stateStream.getValue(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "state", {
        get: function () { return this._state; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "outstandingRequests", {
        get: function () { return this._currentRequests.size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "status", {
        get: function () { return this._statusStream; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "requests", {
        get: function () { return this._requestStream; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "responses", {
        get: function () { return this._responseStream; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "errors", {
        get: function () { return this._errorStream; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactiveClient.prototype, "observe", {
        get: function () { return this._observe; },
        enumerable: true,
        configurable: true
    });
    ReactiveClient.prototype.getCurrentRequests = function () {
        var response = [];
        this._currentRequests.forEach(function (request) {
            response.push({
                command: request.command,
                sequence: lodash_1.cloneDeep(request.sequence),
                request: request.request,
                silent: request.silent,
                duration: Date.now() - request.time.getTime(),
            });
        });
        return response;
    };
    ReactiveClient.prototype.dispose = function () {
        if (this._disposable.isDisposed) {
            return;
        }
        this.disconnect();
        this._disposable.dispose();
    };
    ReactiveClient.prototype.log = function (message, logLevel) {
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
    };
    ReactiveClient.prototype.connect = function () {
        // Currently connecting
        if (this.currentState >= enums_1.DriverState.Downloading && this.currentState <= enums_1.DriverState.Connected) {
            return;
        }
        // Bootstrap plugins here
        this._currentRequests.clear();
        this._driver.connect();
    };
    ReactiveClient.prototype.disconnect = function () {
        this._driver.disconnect();
    };
    ReactiveClient.prototype.request = function (action, request, options) {
        var _this = this;
        var conditions = preconditions_1.getPreconditions(action);
        if (conditions) {
            lodash_1.each(conditions, function (x) { return x(request); });
        }
        if (!options) {
            options = {};
        }
        // Handle disconnected requests
        if (this.currentState !== enums_1.DriverState.Connected && this.currentState !== enums_1.DriverState.Error) {
            return this.state
                .filter(function (z) { return z === enums_1.DriverState.Connected; })
                .take(1)
                .switchMap(function (z) {
                return _this.request(action, request, options);
            });
        }
        var context = new RequestContext_1.RequestContext(this._uniqueId, action, request, options);
        this._currentRequests.add(context);
        this._requestStream.next(context);
        var response = this._queue.enqueue(context);
        // By default the request will only be made if the response is subscribed to...
        // This is a breaking change for clients, potentially a very big one, so this subscribe
        // avoids the problem for the moment
        response.subscribe();
        return response;
    };
    ReactiveClient.prototype.registerFixup = function (func) {
        this._fixups.push(func);
    };
    ReactiveClient.prototype._handleResult = function (context) {
        var _this = this;
        var responseStream = this._getResponseStream(context.command);
        return this._driver.request(context.command, context.request)
            .do(function (data) {
            responseStream.next(new ResponseContext_1.ResponseContext(context, data));
        }, function (error) {
            _this._errorStream.next(new CommandContext_1.CommandContext(context.command, error));
            responseStream.next(new ResponseContext_1.ResponseContext(context, null, true));
            _this._currentRequests.delete(context);
        }, function () {
            _this._currentRequests.delete(context);
        });
    };
    ReactiveClient.prototype._resetDriver = function () {
        if (this._driver) {
            this._disposable.remove(this._driver);
            this._driver.dispose();
        }
        var driver = this._options.driver;
        this._driver = driver(this._options);
        this._disposable.add(this._driver);
        return this._driver;
    };
    ReactiveClient.prototype._getResponseStream = function (key) {
        key = key.toLowerCase();
        if (!this._responseStreams.has(key)) {
            var subject = new rxjs_1.Subject();
            subject.subscribe({
                next: lodash_1.bind(this._responseStream.next, this._responseStream),
            });
            this._responseStreams.set(key, subject);
            return subject;
        }
        return this._responseStreams.get(key);
    };
    ReactiveClient.prototype._fixup = function (action, request, options) {
        lodash_1.each(this._fixups, function (f) { return f(action, request, options); });
    };
    return ReactiveClient;
}());
exports.ReactiveClient = ReactiveClient;
// tslint:disable-next-line:max-classes-per-file
var ReactiveClientEvents = (function () {
    function ReactiveClientEvents(_client) {
        this._client = _client;
    }
    Object.defineProperty(ReactiveClientEvents.prototype, "uniqueId", {
        get: function () { return this._client.uniqueId; },
        enumerable: true,
        configurable: true
    });
    ReactiveClientEvents.prototype.listen = function (key) {
        var value = decorators_1.getInternalValue(this, key);
        if (!value) {
            return decorators_1.setEventOrResponse(this, key);
        }
        return value;
    };
    return ReactiveClientEvents;
}());
exports.ReactiveClientEvents = ReactiveClientEvents;
decorators_1.reference(ReactiveClientEvents.prototype, 'events', 'events');
decorators_1.reference(ReactiveClientEvents.prototype, 'commands', 'commands');
decorators_1.reference(ReactiveClientEvents.prototype, 'state', 'state');
decorators_1.reference(ReactiveClientEvents.prototype, 'status', 'status');
decorators_1.reference(ReactiveClientEvents.prototype, 'requests', 'requests');
decorators_1.reference(ReactiveClientEvents.prototype, 'responses', 'responses');
decorators_1.reference(ReactiveClientEvents.prototype, 'errors', 'errors');
// <#GENERATED />
decorators_1.request(ReactiveClient.prototype, 'getteststartinfo');
decorators_1.request(ReactiveClient.prototype, 'runtest');
decorators_1.request(ReactiveClient.prototype, 'autocomplete');
decorators_1.request(ReactiveClient.prototype, 'changebuffer');
decorators_1.request(ReactiveClient.prototype, 'codecheck');
decorators_1.request(ReactiveClient.prototype, 'codeformat');
decorators_1.request(ReactiveClient.prototype, 'diagnostics');
decorators_1.request(ReactiveClient.prototype, 'close');
decorators_1.request(ReactiveClient.prototype, 'open');
decorators_1.request(ReactiveClient.prototype, 'filesChanged');
decorators_1.request(ReactiveClient.prototype, 'findimplementations');
decorators_1.request(ReactiveClient.prototype, 'findsymbols');
decorators_1.request(ReactiveClient.prototype, 'findusages');
decorators_1.request(ReactiveClient.prototype, 'fixusings');
decorators_1.request(ReactiveClient.prototype, 'formatAfterKeystroke');
decorators_1.request(ReactiveClient.prototype, 'formatRange');
decorators_1.request(ReactiveClient.prototype, 'getcodeactions');
decorators_1.request(ReactiveClient.prototype, 'gotodefinition');
decorators_1.request(ReactiveClient.prototype, 'gotofile');
decorators_1.request(ReactiveClient.prototype, 'gotoregion');
decorators_1.request(ReactiveClient.prototype, 'highlight');
decorators_1.request(ReactiveClient.prototype, 'currentfilemembersasflat');
decorators_1.request(ReactiveClient.prototype, 'currentfilemembersastree');
decorators_1.request(ReactiveClient.prototype, 'metadata');
decorators_1.request(ReactiveClient.prototype, 'navigatedown');
decorators_1.request(ReactiveClient.prototype, 'navigateup');
decorators_1.request(ReactiveClient.prototype, 'packagesearch');
decorators_1.request(ReactiveClient.prototype, 'packagesource');
decorators_1.request(ReactiveClient.prototype, 'packageversion');
decorators_1.request(ReactiveClient.prototype, 'rename');
decorators_1.request(ReactiveClient.prototype, 'runcodeaction');
decorators_1.request(ReactiveClient.prototype, 'signatureHelp');
decorators_1.request(ReactiveClient.prototype, 'gettestcontext');
decorators_1.request(ReactiveClient.prototype, 'typelookup');
decorators_1.request(ReactiveClient.prototype, 'updatebuffer');
decorators_1.request(ReactiveClient.prototype, 'project');
decorators_1.request(ReactiveClient.prototype, 'projects');
decorators_1.request(ReactiveClient.prototype, 'checkalivestatus');
decorators_1.request(ReactiveClient.prototype, 'checkreadystatus');
decorators_1.request(ReactiveClient.prototype, 'stopserver');
decorators_1.response(ReactiveClientEvents.prototype, 'getteststartinfo', '/v2/getteststartinfo');
decorators_1.response(ReactiveClientEvents.prototype, 'runtest', '/v2/runtest');
decorators_1.response(ReactiveClientEvents.prototype, 'autocomplete', '/autocomplete');
decorators_1.response(ReactiveClientEvents.prototype, 'changebuffer', '/changebuffer');
decorators_1.response(ReactiveClientEvents.prototype, 'codecheck', '/codecheck');
decorators_1.response(ReactiveClientEvents.prototype, 'codeformat', '/codeformat');
decorators_1.response(ReactiveClientEvents.prototype, 'diagnostics', '/diagnostics');
decorators_1.response(ReactiveClientEvents.prototype, 'close', '/close');
decorators_1.response(ReactiveClientEvents.prototype, 'open', '/open');
decorators_1.response(ReactiveClientEvents.prototype, 'filesChanged', '/filesChanged');
decorators_1.response(ReactiveClientEvents.prototype, 'findimplementations', '/findimplementations');
decorators_1.response(ReactiveClientEvents.prototype, 'findsymbols', '/findsymbols');
decorators_1.response(ReactiveClientEvents.prototype, 'findusages', '/findusages');
decorators_1.response(ReactiveClientEvents.prototype, 'fixusings', '/fixusings');
decorators_1.response(ReactiveClientEvents.prototype, 'formatAfterKeystroke', '/formatAfterKeystroke');
decorators_1.response(ReactiveClientEvents.prototype, 'formatRange', '/formatRange');
decorators_1.response(ReactiveClientEvents.prototype, 'getcodeactions', '/v2/getcodeactions');
decorators_1.response(ReactiveClientEvents.prototype, 'gotodefinition', '/gotodefinition');
decorators_1.response(ReactiveClientEvents.prototype, 'gotofile', '/gotofile');
decorators_1.response(ReactiveClientEvents.prototype, 'gotoregion', '/gotoregion');
decorators_1.response(ReactiveClientEvents.prototype, 'highlight', '/highlight');
decorators_1.response(ReactiveClientEvents.prototype, 'currentfilemembersasflat', '/currentfilemembersasflat');
decorators_1.response(ReactiveClientEvents.prototype, 'currentfilemembersastree', '/currentfilemembersastree');
decorators_1.response(ReactiveClientEvents.prototype, 'metadata', '/metadata');
decorators_1.response(ReactiveClientEvents.prototype, 'navigatedown', '/navigatedown');
decorators_1.response(ReactiveClientEvents.prototype, 'navigateup', '/navigateup');
decorators_1.response(ReactiveClientEvents.prototype, 'packagesearch', '/packagesearch');
decorators_1.response(ReactiveClientEvents.prototype, 'packagesource', '/packagesource');
decorators_1.response(ReactiveClientEvents.prototype, 'packageversion', '/packageversion');
decorators_1.response(ReactiveClientEvents.prototype, 'rename', '/rename');
decorators_1.response(ReactiveClientEvents.prototype, 'runcodeaction', '/v2/runcodeaction');
decorators_1.response(ReactiveClientEvents.prototype, 'signatureHelp', '/signatureHelp');
decorators_1.response(ReactiveClientEvents.prototype, 'gettestcontext', '/gettestcontext');
decorators_1.response(ReactiveClientEvents.prototype, 'typelookup', '/typelookup');
decorators_1.response(ReactiveClientEvents.prototype, 'updatebuffer', '/updatebuffer');
decorators_1.response(ReactiveClientEvents.prototype, 'project', '/project');
decorators_1.response(ReactiveClientEvents.prototype, 'projects', '/projects');
decorators_1.response(ReactiveClientEvents.prototype, 'checkalivestatus', '/checkalivestatus');
decorators_1.response(ReactiveClientEvents.prototype, 'checkreadystatus', '/checkreadystatus');
decorators_1.response(ReactiveClientEvents.prototype, 'stopserver', '/stopserver');
decorators_1.event(ReactiveClientEvents.prototype, 'projectAdded');
decorators_1.event(ReactiveClientEvents.prototype, 'projectChanged');
decorators_1.event(ReactiveClientEvents.prototype, 'projectRemoved');
decorators_1.event(ReactiveClientEvents.prototype, 'error');
decorators_1.event(ReactiveClientEvents.prototype, 'diagnostic');
decorators_1.event(ReactiveClientEvents.prototype, 'msBuildProjectDiagnostics');
decorators_1.event(ReactiveClientEvents.prototype, 'packageRestoreStarted');
decorators_1.event(ReactiveClientEvents.prototype, 'packageRestoreFinished');
decorators_1.event(ReactiveClientEvents.prototype, 'unresolvedDependencies');
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/reactive/ReactiveClient.js.map