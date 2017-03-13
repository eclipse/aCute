import { expect } from 'chai';
import { defer, startsWith } from 'lodash';
import { resolve } from 'path';
import { Observable } from 'rxjs';
import { DriverState } from '../lib/enums';
import { ReactiveClient as OmnisharpClient } from '../lib/reactive/ReactiveClient';

describe('Omnisharp Server', () => {
    it('must construct', () => {
        // tslint:disable-next-line:no-unused-new
        new OmnisharpClient({
            projectPath: process.cwd()
        });
    });

    describe('state', function (this: Mocha.ISuiteCallbackContext) {
        this.timeout(60000);
        let server: OmnisharpClient;

        beforeEach(() => {
            server = new OmnisharpClient({
                projectPath: process.cwd(),
                logger: console
            });

            server.requests.subscribe(x => console.log('requests', x));
            server.responses.subscribe(x => console.log('responses', x));
            server.connect();

            return server.state
                .startWith(server.currentState)
                .filter(state => state === DriverState.Connected)
                .take(1)
                .toPromise();
        });

        afterEach(() => {
            server.disconnect();
            return Observable.timer(1000).toPromise();
        });

        it('must respond to all requests (string)', () => {
            defer(() => {
                server.request('/checkalivestatus').subscribe();
                server.request('/checkalivestatus').subscribe();
                server.request('/checkalivestatus');
                server.request('/checkalivestatus');
            });

            return server.observe.checkalivestatus
                .take(4)
                .toPromise();
        });

        it('must respond to all requests (method)', () => {
            defer(() => {
                server.checkalivestatus().subscribe();
                server.checkalivestatus().subscribe();
                server.checkalivestatus();
                server.checkalivestatus();
            });

            return server.observe.checkalivestatus
                .take(4)
                .toPromise();
        });

        it('must give status', () => {
            defer(() => {
                server.checkalivestatus();
                server.checkalivestatus();
            });

            return server.status
                .delay(1)
                .take(1)
                .toPromise();
        });
    });

    describe('configuration', function (this: Mocha.ISuiteCallbackContext) {
        this.timeout(60000);
        it('should call with given omnisharp parameters', done => {
            const server = new OmnisharpClient({
                projectPath: resolve(__dirname, '../'),
                logger: {
                    log: message => {
                        try {
                            if (startsWith(message, 'Arguments:')) {
                                expect(message.toLowerCase()).to.contain('--dotnet:alias=notdefault');
                                server.disconnect();
                                done();
                            }
                        } catch (e) {
                            done(e);
                        }
                    },
                    error: message => { /* */ }
                },
                serverOptions: {
                    dotnet: { alias: 'notdefault' }
                }
            });

            server.connect();
        });

        it('should call with given omnisharp parameters (formatting)', done => {
            const server = new OmnisharpClient({
                projectPath: resolve(__dirname, '../'),
                logger: {
                    log: message => {
                        try {
                            if (startsWith(message, 'Arguments:')) {
                                expect(message.toLowerCase()).to.contain('--dotnet:alias=beta4');
                                expect(message.toLowerCase()).to.contain('--formattingoptions:newline=blah');
                                server.disconnect();
                                done();
                            }
                        } catch (e) {
                            done(e);
                        }
                    },
                    error: message => { /* */ }
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
