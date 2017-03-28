"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lodash_1 = require("lodash");
var path_1 = require("path");
var rxjs_1 = require("rxjs");
var enums_1 = require("../lib/enums");
var ReactiveClient_1 = require("../lib/reactive/ReactiveClient");
describe('Omnisharp Server', function () {
    it('must construct', function () {
        // tslint:disable-next-line:no-unused-new
        new ReactiveClient_1.ReactiveClient({
            projectPath: process.cwd()
        });
    });
    describe('state', function () {
        this.timeout(60000);
        var server;
        beforeEach(function () {
            server = new ReactiveClient_1.ReactiveClient({
                projectPath: process.cwd(),
                logger: console
            });
            server.requests.subscribe(function (x) { return console.log('requests', x); });
            server.responses.subscribe(function (x) { return console.log('responses', x); });
            server.connect();
            return server.state
                .startWith(server.currentState)
                .filter(function (state) { return state === enums_1.DriverState.Connected; })
                .take(1)
                .toPromise();
        });
        afterEach(function () {
            server.disconnect();
            return rxjs_1.Observable.timer(1000).toPromise();
        });
        it('must respond to all requests (string)', function () {
            lodash_1.defer(function () {
                server.request('/checkalivestatus').subscribe();
                server.request('/checkalivestatus').subscribe();
                server.request('/checkalivestatus');
                server.request('/checkalivestatus');
            });
            return server.observe.checkalivestatus
                .take(4)
                .toPromise();
        });
        it('must respond to all requests (method)', function () {
            lodash_1.defer(function () {
                server.checkalivestatus().subscribe();
                server.checkalivestatus().subscribe();
                server.checkalivestatus();
                server.checkalivestatus();
            });
            return server.observe.checkalivestatus
                .take(4)
                .toPromise();
        });
        it('must give status', function () {
            lodash_1.defer(function () {
                server.checkalivestatus();
                server.checkalivestatus();
            });
            return server.status
                .delay(1)
                .take(1)
                .toPromise();
        });
    });
    describe('configuration', function () {
        this.timeout(60000);
        it('should call with given omnisharp parameters', function (done) {
            var server = new ReactiveClient_1.ReactiveClient({
                projectPath: path_1.resolve(__dirname, '../'),
                logger: {
                    log: function (message) {
                        try {
                            if (lodash_1.startsWith(message, 'Arguments:')) {
                                chai_1.expect(message.toLowerCase()).to.contain('--dotnet:alias=notdefault');
                                server.disconnect();
                                done();
                            }
                        }
                        catch (e) {
                            done(e);
                        }
                    },
                    error: function (message) { }
                },
                serverOptions: {
                    dotnet: { alias: 'notdefault' }
                }
            });
            server.connect();
        });
        it('should call with given omnisharp parameters (formatting)', function (done) {
            var server = new ReactiveClient_1.ReactiveClient({
                projectPath: path_1.resolve(__dirname, '../'),
                logger: {
                    log: function (message) {
                        try {
                            if (lodash_1.startsWith(message, 'Arguments:')) {
                                chai_1.expect(message.toLowerCase()).to.contain('--dotnet:alias=beta4');
                                chai_1.expect(message.toLowerCase()).to.contain('--formattingoptions:newline=blah');
                                server.disconnect();
                                done();
                            }
                        }
                        catch (e) {
                            done(e);
                        }
                    },
                    error: function (message) { }
                },
                serverOptions: {
                    formattingOptions: { newLine: 'blah' },
                    dotnet: { alias: 'beta4' }
                }
            });
            server.connect();
        });
    });
});
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/omnisharp-client-spec.js.map