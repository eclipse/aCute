"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
var chai_1 = require("chai");
var path_1 = require("path");
var enums_1 = require("../lib/enums");
var plugin_1 = require("../lib/helpers/plugin");
var runtime_1 = require("../lib/helpers/runtime");
describe('Omnisharp Plugin', function () {
    before(function () {
        this.timeout(60000);
        return Promise.all([
            new runtime_1.RuntimeContext({ runtime: enums_1.Runtime.CoreClr, arch: process.arch, platform: process.platform }).downloadRuntimeIfMissing().toPromise(),
            new runtime_1.RuntimeContext({ runtime: enums_1.Runtime.ClrOrMono, arch: process.arch, platform: process.platform }).downloadRuntimeIfMissing().toPromise()
        ]);
    });
    xit('should return the default path to the omnisharp install if no plugins are found', function () {
        var ctx = new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln'), ctx, [], console)
            .toPromise()
            .then(function (result) {
            chai_1.expect(ctx.location).to.be.eql(result);
        });
    });
    xit('should return a custom path when plugins are found', function () {
        var ctx = new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
            .toPromise()
            .then(function (result) {
            chai_1.expect(ctx.location).to.not.be.eql(result);
        });
    });
    xit('should return the same custom path when called more than once when finding a set of plugins', function () {
        var ctx = new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
            .toPromise()
            .then(function (result) {
            chai_1.expect(ctx.location).to.not.be.eql(result);
            return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
                .toPromise()
                .then(function (result2) {
                chai_1.expect(result).to.be.eql(result2);
            });
        });
    });
    xit('should return a custom path when plugins are given', function () {
        var ctx = new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
            .toPromise()
            .then(function (result) {
            chai_1.expect(ctx.location).to.not.be.eql(result);
        });
    });
    xit('should return the same custom path when called more than once given a set of plugins', function () {
        var ctx = new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
            .toPromise()
            .then(function (result) {
            chai_1.expect(ctx.location).to.not.be.eql(result);
            return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
                .toPromise()
                .then(function (result2) {
                chai_1.expect(result).to.be.eql(result2);
            });
        });
    });
    xit('should return the same custom path when called more than once given the same set of plugins', function () {
        var ctx = new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
            .toPromise()
            .then(function (result) {
            chai_1.expect(ctx.location).to.not.be.eql(result);
            return plugin_1.getPluginPath(path_1.join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
                .toPromise()
                .then(function (result2) {
                chai_1.expect(result).to.be.eql(result2);
            });
        });
    });
});
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/omnisharp-plugins-spec.js.map