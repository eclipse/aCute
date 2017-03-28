import { Observable } from 'rxjs';
import { ResponseContext } from '../contexts/ResponseContext';
export declare class RequestQueue {
    private concurrency;
    private queue;
    private requests;
    constructor(concurrency: number);
    enqueue(item: Observable<ResponseContext<any, any>>): void;
    readonly full: boolean;
    readonly pending: boolean;
    drain(): void;
}
