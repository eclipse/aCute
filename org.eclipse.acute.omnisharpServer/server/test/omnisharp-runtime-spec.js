"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-require-imports
var chai_1 = require("chai");
var fs_1 = require("fs");
var path_1 = require("path");
var enums_1 = require("../lib/enums");
var runtime_1 = require("../lib/helpers/runtime");
describe('Omnisharp Runtime', function () {
    it('should get a runtime id', function () {
        return runtime_1.findRuntimeById('dnx-coreclr-dos-x64', path_1.resolve(__dirname, 'fixture/runtimes'))
            .map(function (runtime) {
            chai_1.expect(runtime).to.be.equal('dnx-coreclr-dos-x64.1.0.0-rc2-16389');
        })
            .toPromise();
    });
    it('should return empty if no runtime', function () {
        return runtime_1.findRuntimeById('dnx-coreclr-solaris-x64', path_1.resolve(__dirname, 'fixture/runtimes'))
            .isEmpty()
            .map(function (empty) {
            chai_1.expect(empty).to.be.true;
        })
            .toPromise();
    });
    it('should download the runtimes', function () {
        this.timeout(60000);
        var dir = path_1.resolve(__dirname, 'fixture/rtt/default/');
        try {
            require('rimraf').sync(dir);
        }
        catch (e) { }
        try {
            fs_1.mkdirSync(path_1.resolve(__dirname, 'fixture/rtt'));
        }
        catch (e) { }
        try {
            fs_1.mkdirSync(dir);
        }
        catch (e) { }
        return new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.ClrOrMono,
            arch: process.arch,
            platform: process.platform,
            destination: dir
        }).downloadRuntime()
            .do(function (artifacts) {
            chai_1.expect(artifacts[0]).to.contain('omnisharp');
        })
            .toPromise();
    });
    it('should download a specific runtime', function () {
        this.timeout(60000);
        var dir = path_1.resolve(__dirname, 'fixture/rtt/specific/');
        try {
            require('rimraf').sync(dir);
        }
        catch (e) { }
        try {
            fs_1.mkdirSync(path_1.resolve(__dirname, 'fixture/rtt'));
        }
        catch (e) { }
        try {
            fs_1.mkdirSync(dir);
        }
        catch (e) { }
        return new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.ClrOrMono,
            arch: process.arch,
            platform: process.platform,
            version: 'v1.9-alpha1',
            destination: dir
        }).downloadRuntime()
            .do(function (artifacts) {
            chai_1.expect(artifacts[0]).to.contain('omnisharp');
        })
            .toPromise();
    });
    it('should support coreclr in an environment specific way', function () {
        return runtime_1.isSupportedRuntime(new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        }))
            .toPromise()
            .then(function (_a) {
            var runtime = _a.runtime, path = _a.path;
            chai_1.expect(runtime).to.be.equal(enums_1.Runtime.CoreClr);
            chai_1.expect(path).to.be.equal(process.env.PATH);
        });
    });
    it('should support mono or the clr in an environment specific way', function () {
        return runtime_1.isSupportedRuntime(new runtime_1.RuntimeContext({
            runtime: enums_1.Runtime.ClrOrMono,
            arch: process.arch,
            platform: process.platform
        }))
            .toPromise()
            .then(function (_a) {
            var runtime = _a.runtime, path = _a.path;
            if (process.platform === 'win32') {
                chai_1.expect(enums_1.Runtime[runtime]).to.be.equal(enums_1.Runtime[enums_1.Runtime.ClrOrMono]);
                chai_1.expect(path).to.be.equal(process.env.PATH);
            }
            else if (process.env.TRAVIS_MONO) {
                chai_1.expect(enums_1.Runtime[runtime]).to.be.equal(enums_1.Runtime[enums_1.Runtime.ClrOrMono]);
                chai_1.expect(path).to.not.be.equal(process.env.PATH);
            }
            else {
                chai_1.expect(enums_1.Runtime[runtime]).to.be.equal(enums_1.Runtime[enums_1.Runtime.CoreClr]);
                chai_1.expect(path).to.be.equal(process.env.PATH);
            }
        });
    });
});
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/omnisharp-runtime-spec.js.map