import { RequestContext } from './RequestContext';
export declare class ResponseContext<TRequest, TResponse> {
    clientId: string;
    request: TRequest;
    response: TResponse;
    command: string;
    sequence: string;
    time: Date;
    responseTime: number;
    silent: boolean;
    failed: boolean;
    constructor({clientId, request, command, sequence, time, silent}: RequestContext<any>, response?: TResponse, failed?: boolean);
    isCommand(command: string): boolean | null;
}
