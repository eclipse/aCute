import { Observable, Subscriber, Subscription } from 'rxjs';
export declare const createObservable: <T>(callback: (observer: Subscriber<T>) => Subscription | Function | void) => Observable<T>;
