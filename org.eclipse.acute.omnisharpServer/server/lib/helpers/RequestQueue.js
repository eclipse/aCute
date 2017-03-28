"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var RequestQueue = (function () {
    function RequestQueue(concurrency) {
        this.concurrency = concurrency;
        this.queue = [];
        this.requests = [];
    }
    RequestQueue.prototype.enqueue = function (item) {
        this.queue.push(item);
    };
    Object.defineProperty(RequestQueue.prototype, "full", {
        get: function () {
            return this.requests.length >= this.concurrency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestQueue.prototype, "pending", {
        get: function () {
            return this.queue.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    RequestQueue.prototype.drain = function () {
        var _this = this;
        var i = 0;
        var slots = this.concurrency - this.requests.length;
        var _loop_1 = function () {
            var item = this_1.queue.shift();
            this_1.requests.push(item);
            item.subscribe({
                error: function () {
                    lodash_1.pull(_this.requests, item);
                },
                complete: function () {
                    lodash_1.pull(_this.requests, item);
                }
            });
            if (this_1.full) {
                return { value: void 0 };
            }
        };
        var this_1 = this;
        do {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        } while (this.queue.length && ++i < slots);
    };
    return RequestQueue;
}());
exports.RequestQueue = RequestQueue;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/RequestQueue.js.map