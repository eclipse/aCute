/**
 *
 */
import { CompositeDisposable } from './CompositeDisposable';
import { IDisposable } from './Disposable';
export abstract class DisposableBase implements IDisposable {
    protected _disposable: CompositeDisposable;
    constructor() {
        this._disposable = new CompositeDisposable();
    }

    public dispose() {
        this._disposable.dispose();
    }
}
