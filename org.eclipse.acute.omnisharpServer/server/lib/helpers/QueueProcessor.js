"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var omnisharp_client_1 = require("../omnisharp-client");
var RequestQueue_1 = require("./RequestQueue");
var prioritization_1 = require("./prioritization");
var QueuePriority;
(function (QueuePriority) {
    QueuePriority[QueuePriority["Priority"] = 0] = "Priority";
    QueuePriority[QueuePriority["Normal"] = 1] = "Normal";
    QueuePriority[QueuePriority["Deferred"] = 2] = "Deferred";
})(QueuePriority || (QueuePriority = {}));
function getQueue(context) {
    if (prioritization_1.isPriorityCommand(context)) {
        return QueuePriority.Priority;
    }
    if (prioritization_1.isDeferredCommand(context)) {
        return QueuePriority.Deferred;
    }
    return QueuePriority.Normal;
}
var QueueProcessor = (function () {
    function QueueProcessor(_concurrency, _requestCallback) {
        var _this = this;
        this._concurrency = _concurrency;
        this._requestCallback = _requestCallback;
        this._complete = function () {
            _this._drain();
        };
        // Keep deferred concurrency at a min of two, this lets us get around long running requests jamming the pipes.
        var _deferredConcurrency = Math.max(Math.floor(_concurrency / 4), 2);
        this._priority = new RequestQueue_1.RequestQueue(1);
        this._normal = new RequestQueue_1.RequestQueue(_concurrency);
        this._deferred = new RequestQueue_1.RequestQueue(_deferredConcurrency);
    }
    QueueProcessor.prototype.enqueue = function (context) {
        // const observable = createObservable<any>(observer => {
        //     return Observable.from((<Observable<any>><any>this._requestCallback(context))).subscribe();
        // })
        //     .publishLast()
        //     .refCount()
        //     .do({ error: this._complete, complete: this._complete });
        var _this = this;
        var observable = omnisharp_client_1.createObservable(function (observer) {
            var innerObservable = rxjs_1.Observable.from(_this._requestCallback(context));
            var queue = getQueue(context);
            if (queue === QueuePriority.Priority) {
                _this._priority.enqueue(innerObservable);
            }
            if (queue === QueuePriority.Normal) {
                _this._normal.enqueue(innerObservable);
            }
            if (queue === QueuePriority.Deferred) {
                _this._deferred.enqueue(innerObservable);
            }
            lodash_1.defer(function () { return _this._drain(); });
            return innerObservable
                .do({ error: _this._complete, complete: _this._complete })
                .subscribe(observer);
        });
        // Doing a little bit of tickery here
        // Going to return this Observable, as if it were promise like.
        // And we will only commit to the promise once someone calls then on it.
        // This way another client, can cast the result to an observable, and gain cancelation
        var promiseLike = observable;
        promiseLike.then = (function (fulfilled, rejected) {
            return observable.toPromise().then(fulfilled, rejected);
        });
        // const queue = getQueue(context);
        // if (queue === QueuePriority.Priority) { this._priority.enqueue(observable); }
        // if (queue === QueuePriority.Normal) { this._normal.enqueue(observable); }
        // if (queue === QueuePriority.Deferred) { this._deferred.enqueue(observable); }
        return observable;
    };
    QueueProcessor.prototype._drain = function () {
        // Request inflight
        if (this._priority.full) {
            return;
        }
        if (this._normal.full && this._deferred.full) {
            return;
        }
        if (this._priority.pending) {
            this._priority.drain();
            return;
        }
        if (this._normal.pending) {
            this._normal.drain();
        }
        if (this._deferred.pending) {
            this._deferred.drain();
        }
    };
    return QueueProcessor;
}());
exports.QueueProcessor = QueueProcessor;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/QueueProcessor.js.map