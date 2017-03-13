// tslint:disable
import { expect } from 'chai';
import { join } from 'path';
import { Runtime } from '../lib/enums';
import { getPluginPath } from '../lib/helpers/plugin';
import { RuntimeContext } from '../lib/helpers/runtime';

describe('Omnisharp Plugin', () => {
    before(function (this: Mocha.IBeforeAndAfterContext) {
        this.timeout(60000);
        return Promise.all([
            new RuntimeContext({ runtime: Runtime.CoreClr, arch: process.arch, platform: process.platform }).downloadRuntimeIfMissing().toPromise(),
            new RuntimeContext({ runtime: Runtime.ClrOrMono, arch: process.arch, platform: process.platform }).downloadRuntimeIfMissing().toPromise()
        ]);
    });

    xit('should return the default path to the omnisharp install if no plugins are found', () => {
        const ctx = new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return getPluginPath(join(__dirname, 'fixture/plugins/sln'), ctx, [], console)
            .toPromise()
            .then((result) => {
                expect(ctx.location).to.be.eql(result);
            });
    });

    xit('should return a custom path when plugins are found', () => {
        const ctx = new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return getPluginPath(join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
            .toPromise()
            .then((result) => {
                expect(ctx.location).to.not.be.eql(result);
            });
    });

    xit('should return the same custom path when called more than once when finding a set of plugins', () => {
        const ctx = new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return getPluginPath(join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
            .toPromise()
            .then((result) => {
                expect(ctx.location).to.not.be.eql(result);

                return getPluginPath(join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
                    .toPromise()
                    .then((result2) => {
                        expect(result).to.be.eql(result2);
                    });
            });
    });

    xit('should return a custom path when plugins are given', () => {
        const ctx = new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return getPluginPath(join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
            .toPromise()
            .then((result) => {
                expect(ctx.location).to.not.be.eql(result);
            });
    });

    xit('should return the same custom path when called more than once given a set of plugins', () => {
        const ctx = new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return getPluginPath(join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
            .toPromise()
            .then((result) => {
                expect(ctx.location).to.not.be.eql(result);

                return getPluginPath(join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
                    .toPromise()
                    .then((result2) => {
                        expect(result).to.be.eql(result2);
                    });
            });
    });

    xit('should return the same custom path when called more than once given the same set of plugins', () => {
        const ctx = new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        });
        return getPluginPath(join(__dirname, 'fixture/plugins/sln'), ctx, [{ 'name': 'OmniSharp.Dnx', 'version': '1.0.0-*' }, { 'name': 'OmniSharp.MSBuild', 'version': '1.0.0-*' }], console)
            .toPromise()
            .then((result) => {
                expect(ctx.location).to.not.be.eql(result);

                return getPluginPath(join(__dirname, 'fixture/plugins/sln-with-plugins'), ctx, [], console)
                    .toPromise()
                    .then((result2) => {
                        expect(result).to.be.eql(result2);
                    });
            });
    });
});
