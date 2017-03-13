import { cloneDeep, isObject, uniqueId } from 'lodash';
import { Observable } from 'rxjs';

import * as OmniSharp from '../omnisharp-server';
import { createObservable } from '../operators/create';
import { ResponseContext } from './ResponseContext';
// tslint:disable-next-line:no-var-requires no-require-imports
const stripBom = require('strip-bom');

export class RequestContext<T extends OmniSharp.Models.Request> {
    public command: string;
    public request: T;
    public sequence: string;
    public time: Date;
    public silent: boolean;

    public constructor(
        public clientId: string,
        command: string,
        request: T,
        { silent }: OmniSharp.RequestOptions,
        sequence = uniqueId('__request')) {
        if (command) {
            this.command = command.toLowerCase();
        }

        if (isObject<OmniSharp.Models.Request>(request)) {
            if (request.Buffer) {
                request.Buffer = stripBom(request.Buffer);
            }
            const obj = cloneDeep(request);
            this.request = <any>Object.freeze(obj);
        } else {
            this.request = request;
        }

        this.silent = !!silent;
        this.sequence = sequence;
        this.time = new Date();
        Object.freeze(this);
    }

    public isCommand(command: string) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    }

    public getResponse<TResponse>(stream: Observable<ResponseContext<T, TResponse>>) {
        return createObservable<TResponse>(observer =>
            stream.first(res => res.sequence === this.sequence).subscribe(res => {
                if (!res.failed) {
                    observer.next(res.response);
                    observer.complete();
                } else {
                    observer.complete();
                }
            }));
    }
}
