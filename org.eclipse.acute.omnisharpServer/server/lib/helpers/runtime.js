"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var lodash_1 = require("lodash");
var path_1 = require("path");
var rxjs_1 = require("rxjs");
var enums_1 = require("../enums");
var create_1 = require("../operators/create");
var decompress_1 = require("./decompress");
var platform_1 = require("./platform");
// tslint:disable:no-var-requires no-require-imports
var request = require('request');
// tslint:disable-next-line:non-literal-require
var defaultServerVersion = require(path_1.resolve(__dirname, '../../package.json'))['omnisharp-roslyn'];
var exists = rxjs_1.Observable.bindCallback(fs.exists);
var readFile = rxjs_1.Observable.bindNodeCallback(fs.readFile);
var defaultDest = path_1.resolve(__dirname, '../../');
// tslint:enable:no-var-requires no-require-imports
// Handle the case of homebrew mono
var PATH = lodash_1.find(process.env, function (v, key) { return lodash_1.toLower(key) === 'path'; })
    .split(path_1.delimiter)
    .concat(['/usr/local/bin', '/Library/Frameworks/Mono.framework/Commands']);
var RuntimeContext = (function () {
    function RuntimeContext(runtimeContext, _logger) {
        this._logger = _logger;
        if (!_logger) {
            this._logger = console;
        }
        var self = this;
        lodash_1.assignWith(self, runtimeContext || {}, function (obj, src, key) {
            self["_" + key] = obj || src;
        });
        if (lodash_1.isNull(this._runtime) || lodash_1.isUndefined(this._runtime)) {
            this._runtime = enums_1.Runtime.ClrOrMono;
        }
        if (lodash_1.isNull(this._platform) || lodash_1.isUndefined(this._platform)) {
            this._platform = platform_1.supportedPlatform;
        }
        else {
            this._platform = platform_1.getSupportedPlatform(runtimeContext.platform);
        }
        if (lodash_1.isNull(this._arch) || lodash_1.isUndefined(this._arch)) {
            this._arch = process.arch;
        }
        if (lodash_1.isNull(this._version) || lodash_1.isUndefined(this._version)) {
            this._version = defaultServerVersion;
        }
        this._arch = this._arch === 'x86' ? 'x86' : 'x64';
        this._os = this._getOsName();
        this._key = this._getIdKey();
        this._id = "omnisharp-" + this._key;
        if (lodash_1.isNull(this._location) || lodash_1.isUndefined(this._location)) {
            this._location = this._getRuntimeLocation();
        }
        if (lodash_1.isNull(this._destination) || lodash_1.isUndefined(this._destination)) {
            this._destination = path_1.resolve(defaultDest, this._id);
        }
        Object.freeze(this);
    }
    Object.defineProperty(RuntimeContext.prototype, "runtime", {
        get: function () { return this._runtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "platform", {
        get: function () { return this._platform; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "arch", {
        get: function () { return this._arch; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "bootstrap", {
        get: function () { return this._bootstrap; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "version", {
        get: function () { return this._version; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "destination", {
        get: function () { return this._destination; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RuntimeContext.prototype, "location", {
        get: function () { return this._location; },
        enumerable: true,
        configurable: true
    });
    RuntimeContext.prototype.findRuntime = function (location) {
        if (location === void 0) { location = path_1.resolve(defaultDest); }
        return findRuntimeById(this._id, location);
    };
    RuntimeContext.prototype.downloadRuntime = function () {
        var _this = this;
        return rxjs_1.Observable.defer(function () { return rxjs_1.Observable.concat(
        // downloadSpecificRuntime("omnisharp.bootstrap", ctx, logger, dest),
        _this._downloadSpecificRuntime('omnisharp')); })
            .subscribeOn(rxjs_1.Scheduler.async)
            .toArray()
            .concatMap(function () { return rxjs_1.Observable.bindCallback(fs.writeFile)(path_1.join(_this._destination, '.version'), _this._version); }, function (result) { return result; });
    };
    RuntimeContext.prototype.downloadRuntimeIfMissing = function () {
        var _this = this;
        return this._ensureCurrentVersion()
            .flatMap(function (isCurrent) {
            return _this.findRuntime().isEmpty();
        })
            .flatMap(function (empty) { return rxjs_1.Observable.if(function () { return empty; }, _this.downloadRuntime()); });
    };
    RuntimeContext.prototype.downloadFile = function (url, path) {
        var _this = this;
        if (this._logger) {
            this._logger.log("Downloading " + path);
        }
        return create_1.createObservable(function (observer) {
            request.get(url)
                .pipe(fs.createWriteStream(path))
                .on('error', lodash_1.bind(observer.error, observer))
                .on('finish', function () {
                if (_this._logger) {
                    _this._logger.log("Finished downloading " + path);
                }
                observer.next(void 0);
                observer.complete();
            });
        });
    };
    RuntimeContext.prototype._getIdKey = function () {
        if (this._platform !== platform_1.SupportedPlatform.Windows && this._runtime === enums_1.Runtime.ClrOrMono) {
            return "mono";
        }
        var runtimeName = 'netcoreapp1.0';
        if (this._runtime === enums_1.Runtime.ClrOrMono) {
            if (this._platform === platform_1.SupportedPlatform.Windows) {
                runtimeName = 'net46';
            }
            else {
                runtimeName = 'mono';
            }
        }
        return this._os + "-" + this._arch + "-" + runtimeName;
    };
    RuntimeContext.prototype._getOsName = function () {
        if (this._platform === platform_1.SupportedPlatform.Windows) {
            return 'win';
        }
        var name = platform_1.SupportedPlatform[this._platform];
        if (name) {
            return name.toLowerCase();
        }
        return name;
    };
    /* tslint:disable:no-string-literal */
    RuntimeContext.prototype._getRuntimeLocation = function () {
        var path = process.env['OMNISHARP'];
        if (!path) {
            var omnisharp = process.platform === 'win32' || this._runtime === enums_1.Runtime.ClrOrMono ? 'OmniSharp.exe' : 'OmniSharp';
            path = path_1.resolve(__dirname, '../../', this._id, omnisharp);
        }
        if (process.platform !== 'win32' && this._runtime === enums_1.Runtime.ClrOrMono) {
            return "mono " + path;
        }
        return path;
    };
    /* tslint:enable:no-string-literal */
    RuntimeContext.prototype._checkCurrentVersion = function () {
        var _this = this;
        var filename = path_1.join(this._destination, '.version');
        return exists(filename)
            .flatMap(function (isCurrent) {
            return _this.findRuntime().isEmpty();
        }, function (ex, isEmpty) { return ex && !isEmpty; })
            .flatMap(function (ex) { return rxjs_1.Observable.if(function () { return ex; }, rxjs_1.Observable.defer(function () { return readFile(filename).map(function (content) { return content.toString().trim() === _this._version; }); }), rxjs_1.Observable.of(false)); });
    };
    RuntimeContext.prototype._ensureCurrentVersion = function () {
        var dest = this._destination;
        return this._checkCurrentVersion()
            .flatMap(function (isCurrent) { return rxjs_1.Observable.if(function () { return !isCurrent; }, rxjs_1.Observable.defer(function () { return create_1.createObservable(function (observer) {
            dest = dest || defaultDest;
            // tslint:disable-next-line:no-require-imports
            require('rimraf')(dest, function (err) {
                if (err) {
                    observer.error(err);
                    return;
                }
                lodash_1.delay(function () {
                    observer.next(isCurrent);
                    observer.complete();
                }, 500);
            });
        }); }), rxjs_1.Observable.of(isCurrent)); });
    };
    RuntimeContext.prototype._downloadSpecificRuntime = function (name) {
        var _this = this;
        var filename = name + "-" + this._key + "." + (this._platform === platform_1.SupportedPlatform.Windows ? 'zip' : 'tar.gz');
        var destination = this._destination;
        try {
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination);
            }
        }
        catch (e) { }
        var url = "https://github.com/OmniSharp/omnisharp-roslyn/releases/download/" + this._version + "/" + filename;
        var path = path_1.join(destination, filename);
        return rxjs_1.Observable.defer(function () { return rxjs_1.Observable.concat(_this.downloadFile(url, path).delay(100), rxjs_1.Observable.defer(function () { return _this._extract(_this._platform === platform_1.SupportedPlatform.Windows, path, destination); }))
            .do({ complete: function () { try {
                fs.unlinkSync(path);
            }
            catch (e) { } } })
            .subscribeOn(rxjs_1.Scheduler.async); })
            .map(function () { return name; });
    };
    RuntimeContext.prototype._extract = function (win32, path, dest) {
        if (this._logger) {
            this._logger.log("Extracting " + path);
        }
        return decompress_1.decompress(path, dest, { mode: '755' });
    };
    return RuntimeContext;
}());
exports.RuntimeContext = RuntimeContext;
exports.isSupportedRuntime = lodash_1.memoize(function (ctx) {
    return rxjs_1.Observable.defer(function () {
        var subject = new rxjs_1.AsyncSubject();
        // On windows we'll just use the clr, it's there
        // On mac / linux if we've picked CoreClr stick with that
        if (ctx.platform === platform_1.SupportedPlatform.Windows || ctx.runtime === enums_1.Runtime.CoreClr) {
            return rxjs_1.Observable.of({ runtime: ctx.runtime, path: process.env.PATH });
        }
        // We need to check if mono exists on the system
        // If it doesn't we'll just run CoreClr
        rxjs_1.Observable.from(PATH)
            .map(function (path) { return path_1.join(path, 'mono'); })
            .concatMap(function (path) { return exists(path).map(function (e) { return ({ exists: e, path: path }); }); })
            .filter(function (x) { return x.exists; })
            .map(function (x) { return ({ runtime: enums_1.Runtime.ClrOrMono, path: [x.path].concat(PATH).join(path_1.delimiter) }); })
            .take(1)
            .defaultIfEmpty({ runtime: enums_1.Runtime.CoreClr, path: process.env.PATH })
            .subscribe(subject);
        return subject.asObservable();
    });
}, function (_a) {
    var platform = _a.platform, arch = _a.arch, runtime = _a.runtime, version = _a.version;
    return arch + "-" + platform + ":" + enums_1.Runtime[runtime] + ":" + version;
});
function findOmnisharpExecuable(runtimeId, location) {
    return rxjs_1.Observable.merge(exists(path_1.resolve(location, runtimeId, 'OmniSharp.exe')), exists(path_1.resolve(location, runtimeId, 'OmniSharp')))
        .filter(function (x) { return x; })
        .take(1)
        .share();
}
function findRuntimeById(runtimeId, location) {
    return findOmnisharpExecuable(runtimeId, location)
        .map(function (x) { return path_1.resolve(location, runtimeId); })
        .share();
}
exports.findRuntimeById = findRuntimeById;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/runtime.js.map