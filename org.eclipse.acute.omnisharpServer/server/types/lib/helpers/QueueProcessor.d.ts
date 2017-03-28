import { RequestContext } from '../contexts/RequestContext';
export declare class QueueProcessor<TResponse> {
    private _concurrency;
    private _requestCallback;
    private _priority;
    private _normal;
    private _deferred;
    constructor(_concurrency: number, _requestCallback: (context: RequestContext<any>) => TResponse);
    enqueue(context: RequestContext<any>): TResponse;
    private _drain();
    private _complete;
}
