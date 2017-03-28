"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ReactiveClient_1 = require("../lib/reactive/ReactiveClient");
var ReactiveCombinationClient_1 = require("../lib/reactive/ReactiveCombinationClient");
var ReactiveObservationClient_1 = require("../lib/reactive/ReactiveObservationClient");
describe('Decorator Methods', function () {
    it('ReactiveClient', function () {
        var client = new ReactiveClient_1.ReactiveClient({ projectPath: process.cwd() });
        chai_1.expect(client.updatebuffer).to.equal(client.updatebuffer);
        chai_1.expect(client.changebuffer).to.equal(client.changebuffer);
        chai_1.expect(client.codecheck).to.equal(client.codecheck);
        chai_1.expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        chai_1.expect(client.codeformat).to.equal(client.codeformat);
        chai_1.expect(client.observe.updatebuffer).to.equal(client.observe.updatebuffer);
        chai_1.expect(client.observe.changebuffer).to.equal(client.observe.changebuffer);
        chai_1.expect(client.observe.codeformat).to.equal(client.observe.codeformat);
        chai_1.expect(client.observe.packageRestoreStarted).to.equal(client.observe.packageRestoreStarted);
        chai_1.expect(client.observe.events).to.equal(client.observe.events);
    });
    it('ReactiveObservationClient', function () {
        var client = new ReactiveObservationClient_1.ReactiveObservationClient();
        chai_1.expect(client.updatebuffer).to.equal(client.updatebuffer);
        chai_1.expect(client.changebuffer).to.equal(client.changebuffer);
        chai_1.expect(client.codecheck).to.equal(client.codecheck);
        chai_1.expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        chai_1.expect(client.codeformat).to.equal(client.codeformat);
        chai_1.expect(client.signatureHelp).to.equal(client.signatureHelp);
    });
    it('ReactiveCombinationClient', function () {
        var client = new ReactiveCombinationClient_1.ReactiveCombinationClient();
        chai_1.expect(client.updatebuffer).to.equal(client.updatebuffer);
        chai_1.expect(client.changebuffer).to.equal(client.changebuffer);
        chai_1.expect(client.codecheck).to.equal(client.codecheck);
        chai_1.expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        chai_1.expect(client.codeformat).to.equal(client.codeformat);
    });
});
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/validate-proxies-spec.js.map