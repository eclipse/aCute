import { cloneDeep, isObject, uniqueId } from 'lodash';
import { Observable } from 'rxjs';

import * as OmniSharp from '../omnisharp-server';
import { createObservable } from '../operators/create';
import { RequestContext } from './RequestContext';
// tslint:disable-next-line:no-var-requires no-require-imports
const stripBom = require('strip-bom');

export class ResponseContext<TRequest, TResponse> {
    public clientId: string;
    public request: TRequest;
    public response: TResponse;
    public command: string;
    public sequence: string;
    public time: Date;
    public responseTime: number;
    public silent: boolean;
    public failed: boolean;

    public constructor(
        { clientId, request, command, sequence, time, silent }: RequestContext<any>,
        response: TResponse = <any>{},
        failed = false) {
        if (command) {
            this.command = command.toLowerCase();
        }

        if (isObject(response)) {
            this.response = <any>Object.freeze(response);
        } else {
            this.response = response;
        }

        this.clientId = clientId;
        this.request = request;
        this.command = command;
        this.sequence = sequence;
        this.time = new Date();
        this.silent = !!silent;
        this.failed = !!failed;
        this.responseTime = this.time.getTime() - time.getTime();
        Object.freeze(this);
    }

    public isCommand(command: string) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    }
}
