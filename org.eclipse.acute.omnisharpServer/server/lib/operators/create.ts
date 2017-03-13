import { Observable, Subscriber, Subscription } from 'rxjs';
// tslint:disable-next-line:export-name
export const createObservable: <T>(callback: (observer: Subscriber<T>) => Subscription | Function | void) => Observable<T> = <any>Observable.create;
