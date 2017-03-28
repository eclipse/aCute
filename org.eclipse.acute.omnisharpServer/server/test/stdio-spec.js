"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lodash_1 = require("lodash");
var path_1 = require("path");
var StdioDriver_1 = require("../lib/drivers/StdioDriver");
describe('Omnisharp Local - Stdio', function () {
    it('must construct', function () {
        // tslint:disable-next-line:no-unused-new
        new StdioDriver_1.StdioDriver({
            projectPath: path_1.resolve(__dirname, '../'),
            onEvent: lodash_1.noop,
            onState: lodash_1.noop,
            onCommand: lodash_1.noop
        });
    });
    it('must construct with a specific driver', function () {
        // tslint:disable-next-line:no-unused-new
        new StdioDriver_1.StdioDriver({
            projectPath: path_1.resolve(__dirname, '../'),
            onEvent: lodash_1.noop,
            onState: lodash_1.noop,
            onCommand: lodash_1.noop
        });
    });
    describe('properties', function () {
        this.timeout(60000);
        it('should implement the interface', function (done) {
            done = lodash_1.once(done);
            var server = new StdioDriver_1.StdioDriver({
                projectPath: path_1.resolve(__dirname, '../'),
                onEvent: lodash_1.noop,
                onState: function (v) {
                    chai_1.expect(server.currentState).to.be.not.null;
                    chai_1.expect(server.outstandingRequests).to.be.not.null;
                    server.disconnect();
                    done();
                },
                onCommand: lodash_1.noop
            });
            server.connect();
        });
    });
    /*describe("properties", () => {
        this.timeout(60000);
        it("should disconnect if no an invalid project path is given", function(done) {
            const server = new Stdio({
                projectPath: "/invalid/path/to/things/"
            });

            const sub = server.state.subscribe(state => {
                const sub2 = server.state.filter(z => z === DriverState.Error).subscribe(state => {
                    expect(state).to.be.eql(DriverState.Error);
                    done();
                    sub2.dispose();
                });
                expect(state).to.be.eql(DriverState.Connecting);
                sub.dispose();
            });
            server.connect();
        })
    });*/
});
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/stdio-spec.js.map