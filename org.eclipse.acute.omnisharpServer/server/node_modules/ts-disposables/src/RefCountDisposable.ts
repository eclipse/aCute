/**
 *
 */
import { Disposable, IDisposable, IDisposableOrSubscription } from './Disposable';

export class RefCountDisposable implements IDisposable {
    private _underlyingDisposable: IDisposable;
    private _isDisposed = false;
    private _isPrimaryDisposed = false;
    private _count = 0;

    constructor(underlyingDisposable: IDisposableOrSubscription) {
        this._underlyingDisposable = Disposable.of(underlyingDisposable);
    }

    public get isDisposed() { return this._isDisposed; }

    public dispose() {
        if (!this.isDisposed && !this._isPrimaryDisposed) {
            this._isPrimaryDisposed = true;
            if (this._count === 0) {
                this._isDisposed = true;
                this._underlyingDisposable.dispose();
            }
        }
    }

    public getDisposable() {
        if (this.isDisposed) { return Disposable.empty; }

        this._count += 1;
        return new InnerDisposable(this, () => {
            this._count -= 1;
            if (this._count === 0 && this._isPrimaryDisposed) {
                this._isDisposed = true;
                this._underlyingDisposable.dispose();
            }
        });
    }
}

class InnerDisposable extends Disposable {
    constructor(private _reference: RefCountDisposable, action: () => void) {
        super(action);
    }

    public dispose() {
        if (!this._reference.isDisposed && !this.isDisposed) {
            super.dispose();
        }
    }
}
