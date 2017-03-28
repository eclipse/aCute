"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
var cp = require("child_process");
var lodash_1 = require("lodash");
var readline = require("readline");
var rxjs_1 = require("rxjs");
var ts_disposables_1 = require("ts-disposables");
var enums_1 = require("../enums");
var enums_2 = require("../enums");
var runtime_1 = require("../helpers/runtime");
var spawn = cp.spawn;
if (process.platform === 'win32') {
    // tslint:disable-next-line:no-var-requires no-require-imports
    spawn = require('../windows/super-spawn').spawn;
}
var env = lodash_1.defaults({ ATOM_SHELL_INTERNAL_RUN_AS_NODE: '1' }, process.env);
var StdioDriver = (function () {
    function StdioDriver(_a) {
        var projectPath = _a.projectPath, serverPath = _a.serverPath, findProject = _a.findProject, logger = _a.logger, timeout = _a.timeout, additionalArguments = _a.additionalArguments, runtime = _a.runtime, plugins = _a.plugins, version = _a.version, onEvent = _a.onEvent, onState = _a.onState, onCommand = _a.onCommand;
        var _this = this;
        this.currentState = enums_2.DriverState.Disconnected;
        this._outstandingRequests = new Map();
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._projectPath = projectPath;
        this._findProject = findProject || false;
        this._logger = logger || console;
        this._serverPath = serverPath;
        this._timeout = (timeout || 60) * 1000;
        this._runtime = runtime || enums_1.Runtime.ClrOrMono;
        this._additionalArguments = additionalArguments || [];
        this._plugins = plugins || [];
        this._version = version;
        this._onEvent = onEvent || lodash_1.noop;
        this._onState = function (state) {
            if (state !== _this.currentState) {
                (onState || lodash_1.noop)(state);
                _this.currentState = state;
            }
        };
        this._onCommand = onCommand || lodash_1.noop;
        this._runtimeContext = this._getRuntimeContext();
        this._disposable.add(ts_disposables_1.Disposable.create(function () {
            if (_this._process) {
                _this._process.removeAllListeners();
            }
        }));
        this._disposable.add(ts_disposables_1.Disposable.create(function () {
            _this._outstandingRequests.clear();
        }));
    }
    StdioDriver.prototype.dispose = function () {
        if (this._disposable.isDisposed) {
            return;
        }
        this.disconnect();
        this._disposable.dispose();
    };
    Object.defineProperty(StdioDriver.prototype, "serverPath", {
        get: function () {
            if (this._serverPath) {
                return this._serverPath;
            }
            return this._runtimeContext.location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdioDriver.prototype, "projectPath", {
        get: function () { return this._projectPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdioDriver.prototype, "runtime", {
        get: function () { return this._runtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StdioDriver.prototype, "outstandingRequests", {
        get: function () { return this._outstandingRequests.size; },
        enumerable: true,
        configurable: true
    });
    StdioDriver.prototype.connect = function () {
        var _this = this;
        if (this._disposable.isDisposed) {
            throw new Error('Driver is disposed');
        }
        this._ensureRuntimeExists()
            .then(function () { return _this._connect(); });
    };
    StdioDriver.prototype.disconnect = function () {
        // tslint:disable-next-line:triple-equals
        if (this._process != null && this._process.pid) {
            this._process.kill('SIGTERM');
        }
        this._process = null;
        this._onState(enums_2.DriverState.Disconnected);
    };
    StdioDriver.prototype.request = function (command, request) {
        if (!this._process) {
            return rxjs_1.Observable.throw(new Error('Server is not connected, erroring out'));
        }
        var sequence = this._seq++;
        var packet = {
            Command: lodash_1.trimStart(command, '/'),
            Seq: sequence,
            Arguments: request
        };
        var subject = new rxjs_1.AsyncSubject();
        var response = subject
            .asObservable();
        // Doing a little bit of tickery here
        // Going to return this Observable, as if it were promise like.
        // And we will only commit to the promise once someone calls then on it.
        // This way another client, can cast the result to an observable, and gain cancelation
        var promiseLike = response;
        promiseLike.then = (function (fulfilled, rejected) {
            return response.toPromise().then(fulfilled, rejected);
        });
        this._outstandingRequests.set(sequence, subject);
        this._process.stdin.write(JSON.stringify(packet) + '\n', 'utf8');
        return promiseLike;
    };
    StdioDriver.prototype.updatePlugins = function (plugins) {
        this._plugins = plugins;
        this.disconnect();
        this.connect();
    };
    StdioDriver.prototype._getRuntimeContext = function () {
        return new runtime_1.RuntimeContext({
            runtime: this.runtime,
            platform: process.platform,
            arch: process.arch,
            version: this._version || undefined
        }, this._logger);
    };
    StdioDriver.prototype._connect = function () {
        var _this = this;
        this._seq = 1;
        this._outstandingRequests.clear();
        this._onState(enums_2.DriverState.Connecting);
        var path = this.serverPath;
        this._logger.log("Connecting to child @ " + process.execPath);
        this._logger.log("Path to server: " + path);
        this._logger.log("Selected project: " + this._projectPath);
        env.PATH = this._PATH || env.PATH;
        var serverArguments = [
            '--stdio',
            '--zero-based-indices',
            '-s', this._projectPath,
            '--hostPID',
            process.pid
        ].concat(this._additionalArguments || []);
        if (lodash_1.startsWith(path, 'mono ')) {
            serverArguments.unshift(path.substr(5));
            path = 'mono';
        }
        this._logger.log("Arguments: " + serverArguments);
        this._process = spawn(path, serverArguments, { env: env });
        if (!this._process.pid) {
            this._serverErr('failed to connect to connect to server');
            return;
        }
        this._process.stderr.on('data', function (data) { return _this._logger.error(data.toString()); });
        this._process.stderr.on('data', function (data) { return _this._serverErr(data); });
        var rl = readline.createInterface({
            input: this._process.stdout,
            output: undefined
        });
        rl.on('line', function (data) { return _this._handleData(data); });
        this.id = this._process.pid.toString();
        this._process.on('error', function (data) { return _this._serverErr(data); });
        this._process.on('close', function () { return _this.disconnect(); });
        this._process.on('exit', function () { return _this.disconnect(); });
        this._process.on('disconnect', function () { return _this.disconnect(); });
    };
    StdioDriver.prototype._ensureRuntimeExists = function () {
        var _this = this;
        this._onState(enums_2.DriverState.Downloading);
        return runtime_1.isSupportedRuntime(this._runtimeContext)
            .toPromise()
            .then(function (ctx) {
            _this._runtime = ctx.runtime;
            _this._PATH = ctx.path;
            _this._runtimeContext = _this._getRuntimeContext();
            return ctx;
        })
            .then(function (runtime) {
            return _this._runtimeContext.downloadRuntimeIfMissing()
                .toPromise()
                .then(function () { _this._onState(enums_2.DriverState.Downloaded); });
        });
    };
    StdioDriver.prototype._serverErr = function (data) {
        var friendlyMessage = this._parseError(data);
        this._onState(enums_2.DriverState.Error);
        this._process = null;
        this._onEvent({
            Type: 'error',
            Event: 'error',
            Seq: -1,
            Body: {
                Message: friendlyMessage
            }
        });
    };
    StdioDriver.prototype._parseError = function (data) {
        var message = data.toString();
        if (data.code === 'ENOENT' && data.path === 'mono') {
            message = 'mono could not be found, please ensure it is installed and in your path';
        }
        return message;
    };
    StdioDriver.prototype._handleData = function (data) {
        var packet;
        try {
            packet = JSON.parse(data.trim());
        }
        catch (_error) {
            this._handleNonPacket(data);
        }
        if (packet) {
            this._handlePacket(packet);
        }
    };
    StdioDriver.prototype._handlePacket = function (packet) {
        if (packet.Type === 'response') {
            this._handlePacketResponse(packet);
        }
        else if (packet.Type === 'event') {
            this._handlePacketEvent(packet);
        }
    };
    StdioDriver.prototype._handlePacketResponse = function (response) {
        if (this._outstandingRequests.has(response.Request_seq)) {
            var observer = this._outstandingRequests.get(response.Request_seq);
            this._outstandingRequests.delete(response.Request_seq);
            if (observer.closed) {
                return;
            }
            if (response.Success) {
                observer.next(response.Body);
                observer.complete();
            }
            else {
                observer.error(response.Message);
            }
        }
        else {
            if (response.Success) {
                this._onCommand(response);
            }
            else {
                // TODO: make notification?
            }
        }
    };
    StdioDriver.prototype._handlePacketEvent = function (event) {
        this._onEvent(event);
        if (event.Event === 'started') {
            this._onState(enums_2.DriverState.Connected);
        }
    };
    StdioDriver.prototype._handleNonPacket = function (data) {
        var s = data.toString();
        this._onEvent({
            Type: 'unknown',
            Event: 'unknown',
            Seq: -1,
            Body: {
                Message: s
            }
        });
        var ref = s.match(/Detected an OmniSharp instance already running on port/);
        // tslint:disable-next-line:triple-equals
        if ((ref != null ? ref.length : 0) > 0) {
            this.disconnect();
        }
    };
    return StdioDriver;
}());
exports.StdioDriver = StdioDriver;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/drivers/StdioDriver.js.map