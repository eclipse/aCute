/**
 *
 */
export interface IDisposable {
    dispose(): void;
}

export interface ISubscription {
    unsubscribe(): void;
}

export function isDisposable(value: any): value is IDisposable {
    return !!value.dispose;
}

export function isSubscription(value: any): value is ISubscription {
    return !!value.unsubscribe;
}

export function canBeDisposed(value: any): value is IDisposableOrSubscription {
    return !!(value.dispose || value.unsubscribe) || typeof value === 'function';
}

export type IDisposableOrSubscription = IDisposable | ISubscription | (() => void);
let empty: Disposable;

export class Disposable implements IDisposable {
    public static get empty() { return empty; }

    /* tslint:disable-next-line:no-reserved-keywords no-any */
    public static of(value: any) {
        if (!value) { return empty; }

        if (value.dispose) {
            return <IDisposable>value;
        }
        return new Disposable(value);
    }

    public static create(action: () => void) {
        return new Disposable(action);
    }

    private _action: () => void;
    private _isDisposed = false;

    constructor(value: IDisposableOrSubscription);
    /* tslint:disable-next-line:no-any */
    constructor(value: any) {
        if (!value) { return empty; }

        if (typeof value === 'function') {
            this._action = value;
        } else if (value.unsubscribe) {
            this._action = () => (<ISubscription>value).unsubscribe();
        } else if (value.dispose) {
            this._action = () => (<IDisposable>value).dispose();
        }
    }

    public get isDisposed() { return this._isDisposed; }

    public dispose() {
        if (!this.isDisposed) {
            this._isDisposed = true;
            this._action();
        }
    }
}

empty = new Disposable(() => { /* */ });
