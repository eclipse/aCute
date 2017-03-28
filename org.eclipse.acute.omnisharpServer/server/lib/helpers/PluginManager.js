"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var ts_disposables_1 = require("ts-disposables");
var PluginManager = (function () {
    function PluginManager(plugins) {
        var _this = this;
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._pluginsChanged = new rxjs_1.Subject();
        this._currentBootstrap = null;
        this._observePluginsChanged = this._pluginsChanged.debounceTime(1000);
        this._plugins = new Set();
        lodash_1.each(plugins, function (plugin) {
            _this._plugins.add(plugin);
        });
        this._disposable.add(this._pluginsChanged.subscribe(function () { return _this._currentBootstrap = null; }));
    }
    Object.defineProperty(PluginManager.prototype, "changed", {
        get: function () { return this._observePluginsChanged; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PluginManager.prototype, "plugins", {
        get: function () { return this._plugins; },
        enumerable: true,
        configurable: true
    });
    PluginManager.prototype.add = function (plugin) {
        this._plugins.add(plugin);
        this._pluginsChanged.next(true);
    };
    PluginManager.prototype.remove = function (plugin) {
        this._plugins.delete(plugin);
        this._pluginsChanged.next(true);
    };
    PluginManager.prototype.dispose = function () {
        this._disposable.dispose();
    };
    return PluginManager;
}());
exports.PluginManager = PluginManager;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/PluginManager.js.map