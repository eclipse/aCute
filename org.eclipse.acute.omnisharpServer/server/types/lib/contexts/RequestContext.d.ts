import { Observable } from 'rxjs';
import * as OmniSharp from '../omnisharp-server';
import { ResponseContext } from './ResponseContext';
export declare class RequestContext<T extends OmniSharp.Models.Request> {
    clientId: string;
    command: string;
    request: T;
    sequence: string;
    time: Date;
    silent: boolean;
    constructor(clientId: string, command: string, request: T, {silent}: OmniSharp.RequestOptions, sequence?: string);
    isCommand(command: string): boolean | null;
    getResponse<TResponse>(stream: Observable<ResponseContext<T, TResponse>>): Observable<TResponse>;
}
