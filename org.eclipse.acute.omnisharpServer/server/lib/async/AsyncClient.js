"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
/* tslint:disable:no-any */
var events_1 = require("events");
var lodash_1 = require("lodash");
var ts_disposables_1 = require("ts-disposables");
var CommandContext_1 = require("../contexts/CommandContext");
var RequestContext_1 = require("../contexts/RequestContext");
var ResponseContext_1 = require("../contexts/ResponseContext");
var enums_1 = require("../enums");
var QueueProcessor_1 = require("../helpers/QueueProcessor");
var decorators_1 = require("../helpers/decorators");
var preconditions_1 = require("../helpers/preconditions");
var options_1 = require("../options");
var AsyncEvents = require("./AsyncEvents");
/////
// NOT TESTED
// NOT READY! :)
/////
var AsyncClient = (function () {
    function AsyncClient(_options) {
        var _this = this;
        this._lowestIndexValue = 0;
        this._emitter = new events_1.EventEmitter();
        this._uniqueId = lodash_1.uniqueId('client');
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._currentRequests = new Set();
        this._currentState = enums_1.DriverState.Disconnected;
        this._fixups = [];
        _options.driver = _options.driver || (function (options) {
            // tslint:disable-next-line:no-require-imports
            var item = require('../drivers/StdioDriver');
            var driverFactory = item[lodash_1.keys(item)[0]];
            return new driverFactory(_this._options);
        });
        this._options = lodash_1.defaults(_options, {
            onState: function (state) {
                _this._currentState = state;
                _this._emitter.emit(AsyncEvents.state, state);
            },
            onEvent: function (event) {
                _this._emitter.emit(AsyncEvents.event, event);
            },
            onCommand: function (packet) {
                var response = new ResponseContext_1.ResponseContext(new RequestContext_1.RequestContext(_this._uniqueId, packet.Command, {}, {}, 'command'), packet.Body);
                _this._respondToRequest(packet.Command, response);
            },
        });
        options_1.ensureClientOptions(this._options);
        this._resetDriver();
        var getStatusValues = function () { return ({
            state: _this._driver.currentState,
            outgoingRequests: _this.outstandingRequests,
            hasOutgoingRequests: _this.outstandingRequests > 0,
        }); };
        var lastStatus = {};
        var emitStatus = function () {
            var newStatus = getStatusValues();
            if (!lodash_1.isEqual(getStatusValues(), lastStatus)) {
                lastStatus = newStatus;
                _this._emitter.emit(AsyncEvents.status, lastStatus);
            }
        };
        this._emitter.on(AsyncEvents.request, emitStatus);
        this._emitter.on(AsyncEvents.response, emitStatus);
        this._queue = new QueueProcessor_1.QueueProcessor(this._options.concurrency, lodash_1.bind(this._handleResult, this));
        if (this._options.debug) {
            this._emitter.on(AsyncEvents.response, function (context) {
                _this._emitter.emit(AsyncEvents.event, {
                    Event: 'log',
                    Body: {
                        Message: "/" + context.command + "  " + context.responseTime + "ms (round trip)",
                        LogLevel: 'INFORMATION',
                    },
                    Seq: -1,
                    Type: 'log',
                });
            });
        }
    }
    AsyncClient.prototype.log = function (message, logLevel) {
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
    };
    AsyncClient.prototype.connect = function () {
        // Currently connecting
        if (this.currentState >= enums_1.DriverState.Downloading && this.currentState <= enums_1.DriverState.Connected) {
            return;
        }
        // Bootstrap plugins here
        this._currentRequests.clear();
        this._driver.connect();
    };
    AsyncClient.prototype.disconnect = function () {
        this._driver.disconnect();
    };
    AsyncClient.prototype.request = function (action, request, options) {
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
            return new Promise(function (resolve, reject) {
                var disposable = _this.onState(function (state) {
                    if (state === enums_1.DriverState.Connected) {
                        disposable.dispose();
                        _this.request(action, request, options)
                            .then(resolve, reject);
                    }
                });
            });
        }
        var context = new RequestContext_1.RequestContext(this._uniqueId, action, request, options);
        return new Promise(function (resolve, reject) {
            _this._queue.enqueue(context).then(function (response) { return resolve(response.response); }, reject);
        });
    };
    AsyncClient.prototype.registerFixup = function (func) {
        this._fixups.push(func);
    };
    Object.defineProperty(AsyncClient.prototype, "uniqueId", {
        get: function () { return this._uniqueId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncClient.prototype, "id", {
        get: function () { return this._driver.id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncClient.prototype, "serverPath", {
        get: function () { return this._driver.serverPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncClient.prototype, "projectPath", {
        get: function () { return this._driver.projectPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncClient.prototype, "runtime", {
        get: function () { return this._driver.runtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncClient.prototype, "outstandingRequests", {
        get: function () { return this._currentRequests.size; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AsyncClient.prototype, "currentState", {
        get: function () { return this._currentState; },
        enumerable: true,
        configurable: true
    });
    AsyncClient.prototype.getCurrentRequests = function () {
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
    AsyncClient.prototype.onEvent = function (callback) {
        return this._listen(AsyncEvents.event, callback);
    };
    AsyncClient.prototype.onState = function (callback) {
        return this._listen(AsyncEvents.state, callback);
    };
    AsyncClient.prototype.onStatus = function (callback) {
        return this._listen(AsyncEvents.status, callback);
    };
    AsyncClient.prototype.onRequest = function (callback) {
        return this._listen(AsyncEvents.request, callback);
    };
    AsyncClient.prototype.onResponse = function (callback) {
        return this._listen(AsyncEvents.response, callback);
    };
    AsyncClient.prototype.onError = function (callback) {
        return this._listen(AsyncEvents.error, callback);
    };
    AsyncClient.prototype.dispose = function () {
        if (this._disposable.isDisposed) {
            return;
        }
        this.disconnect();
        this._disposable.dispose();
    };
    AsyncClient.prototype._listen = function (event, callback) {
        var _this = this;
        this._emitter.addListener(AsyncEvents.event, callback);
        return { dispose: function () { return _this._emitter.removeListener(AsyncEvents.event, callback); } };
    };
    AsyncClient.prototype._handleResult = function (context, complete) {
        var _this = this;
        // TODO: Find a way to not repeat the same commands, if there are outstanding (timed out) requests.
        // In some cases for example find usages has taken over 30 seconds, so we shouldn"t hit the server
        //      with multiple of these requests (as we slam the cpU)
        var result = this._driver.request(context.command, context.request);
        var cmp = function () {
            _this._currentRequests.delete(context);
            if (complete) {
                complete();
            }
        };
        return new Promise(function (resolve, reject) {
            result
                .then(function (data) {
                _this._respondToRequest(context.command, new ResponseContext_1.ResponseContext(context, data));
                cmp();
                resolve(data);
            }, function (error) {
                _this._emitter.emit(AsyncEvents.error, new CommandContext_1.CommandContext(context.command, error));
                _this._respondToRequest(context.command, new ResponseContext_1.ResponseContext(context, null, true));
                _this._currentRequests.delete(context);
                cmp();
                reject(error);
            });
        });
    };
    AsyncClient.prototype._resetDriver = function () {
        if (this._driver) {
            this._disposable.remove(this._driver);
            this._driver.dispose();
        }
        var driver = this._options.driver;
        this._driver = driver(this._options);
        this._disposable.add(this._driver);
        return this._driver;
    };
    AsyncClient.prototype._respondToRequest = function (key, response) {
        key = key.toLowerCase();
        this._emitter.emit(key, response);
        this._emitter.emit(AsyncEvents.response, response);
    };
    /* tslint:disable:no-unused-variable */
    AsyncClient.prototype._fixup = function (action, request, options) {
        lodash_1.each(this._fixups, function (f) { return f(action, request, options); });
    };
    return AsyncClient;
}());
exports.AsyncClient = AsyncClient;
// <#GENERATED />
decorators_1.request(AsyncClient.prototype, 'getteststartinfo');
decorators_1.request(AsyncClient.prototype, 'runtest');
decorators_1.request(AsyncClient.prototype, 'autocomplete');
decorators_1.request(AsyncClient.prototype, 'changebuffer');
decorators_1.request(AsyncClient.prototype, 'codecheck');
decorators_1.request(AsyncClient.prototype, 'codeformat');
decorators_1.request(AsyncClient.prototype, 'diagnostics');
decorators_1.request(AsyncClient.prototype, 'close');
decorators_1.request(AsyncClient.prototype, 'open');
decorators_1.request(AsyncClient.prototype, 'filesChanged');
decorators_1.request(AsyncClient.prototype, 'findimplementations');
decorators_1.request(AsyncClient.prototype, 'findsymbols');
decorators_1.request(AsyncClient.prototype, 'findusages');
decorators_1.request(AsyncClient.prototype, 'fixusings');
decorators_1.request(AsyncClient.prototype, 'formatAfterKeystroke');
decorators_1.request(AsyncClient.prototype, 'formatRange');
decorators_1.request(AsyncClient.prototype, 'getcodeactions');
decorators_1.request(AsyncClient.prototype, 'gotodefinition');
decorators_1.request(AsyncClient.prototype, 'gotofile');
decorators_1.request(AsyncClient.prototype, 'gotoregion');
decorators_1.request(AsyncClient.prototype, 'highlight');
decorators_1.request(AsyncClient.prototype, 'currentfilemembersasflat');
decorators_1.request(AsyncClient.prototype, 'currentfilemembersastree');
decorators_1.request(AsyncClient.prototype, 'metadata');
decorators_1.request(AsyncClient.prototype, 'navigatedown');
decorators_1.request(AsyncClient.prototype, 'navigateup');
decorators_1.request(AsyncClient.prototype, 'packagesearch');
decorators_1.request(AsyncClient.prototype, 'packagesource');
decorators_1.request(AsyncClient.prototype, 'packageversion');
decorators_1.request(AsyncClient.prototype, 'rename');
decorators_1.request(AsyncClient.prototype, 'runcodeaction');
decorators_1.request(AsyncClient.prototype, 'signatureHelp');
decorators_1.request(AsyncClient.prototype, 'gettestcontext');
decorators_1.request(AsyncClient.prototype, 'typelookup');
decorators_1.request(AsyncClient.prototype, 'updatebuffer');
decorators_1.request(AsyncClient.prototype, 'project');
decorators_1.request(AsyncClient.prototype, 'projects');
decorators_1.request(AsyncClient.prototype, 'checkalivestatus');
decorators_1.request(AsyncClient.prototype, 'checkreadystatus');
decorators_1.request(AsyncClient.prototype, 'stopserver');
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/async/AsyncClient.js.map