"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs = require("fs");
var path_1 = require("path");
var rxjs_1 = require("rxjs");
var create_1 = require("../operators/create");
var bootstrappedPlugins = new Map();
var exists = rxjs_1.Observable.bindCallback(fs.exists);
var readFile = rxjs_1.Observable.bindNodeCallback(fs.readFile);
// tslint:disable-next-line:no-var-requires no-require-imports
var md5 = require('md5');
// tslint:disable-next-line:export-name
function getPluginPath(solutionLocation, ctx, requestedPlugins, logger) {
    var plugins = [];
    var hashStrings = [];
    var hash;
    requestedPlugins.forEach(function (plugin) {
        plugins.push(plugin);
    });
    return create_1.createObservable(function (observer) {
        logger.log('Bootstrapping ' + solutionLocation);
        // Include the plugins defined in omnisharp.json, they could have changed.
        exists(path_1.join(solutionLocation, 'omnisharp.json'))
            .filter(function (x) { return !!x; })
            .flatMap(function (x) { return readFile(path_1.join(solutionLocation, 'omnisharp.json')); })
            .map(function (x) { return JSON.parse(x.toString()); })
            .do({
            next: function (obj) {
                if (obj.plugins) {
                    hashStrings.push(obj.plugins);
                }
            },
            complete: function () {
                hash = md5(JSON.stringify(plugins.concat(hashStrings)));
                if (bootstrappedPlugins.has(hash)) {
                    observer.next(bootstrappedPlugins.get(hash));
                    observer.complete();
                    return;
                }
                var command = [ctx.location, '-s', solutionLocation].concat(plugins.map(function (x) {
                    if (x.location) {
                        return "--plugins " + x.location;
                    }
                    else if (x.version) {
                        return "--plugin-name " + x.name + "@" + x.version;
                    }
                    else {
                        return "--plugin-name " + x.name;
                    }
                })).join(' ');
                child_process_1.exec(command, function (error, stdout) {
                    if (error) {
                        observer.error(error);
                        return;
                    }
                    var location = stdout.toString().trim();
                    if (location) {
                        // restore(location, ctx, logger).subscribe(observer);
                        return;
                    }
                    observer.next(ctx.location);
                    observer.complete();
                });
            }
        });
    })
        .map(function (path) { return path && path || ctx.location; })
        .do(function (result) {
        if (!bootstrappedPlugins.has(hash)) {
            bootstrappedPlugins.set(hash, result);
        }
        logger.log('Finished bootstrapping ' + solutionLocation);
    });
}
exports.getPluginPath = getPluginPath;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/plugin.js.map