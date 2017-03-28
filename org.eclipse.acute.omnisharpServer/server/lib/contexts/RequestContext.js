"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var create_1 = require("../operators/create");
// tslint:disable-next-line:no-var-requires no-require-imports
var stripBom = require('strip-bom');
var RequestContext = (function () {
    function RequestContext(clientId, command, request, _a, sequence) {
        var silent = _a.silent;
        if (sequence === void 0) { sequence = lodash_1.uniqueId('__request'); }
        this.clientId = clientId;
        if (command) {
            this.command = command.toLowerCase();
        }
        if (lodash_1.isObject(request)) {
            if (request.Buffer) {
                request.Buffer = stripBom(request.Buffer);
            }
            var obj = lodash_1.cloneDeep(request);
            this.request = Object.freeze(obj);
        }
        else {
            this.request = request;
        }
        this.silent = !!silent;
        this.sequence = sequence;
        this.time = new Date();
        Object.freeze(this);
    }
    RequestContext.prototype.isCommand = function (command) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    };
    RequestContext.prototype.getResponse = function (stream) {
        var _this = this;
        return create_1.createObservable(function (observer) {
            return stream.first(function (res) { return res.sequence === _this.sequence; }).subscribe(function (res) {
                if (!res.failed) {
                    observer.next(res.response);
                    observer.complete();
                }
                else {
                    observer.complete();
                }
            });
        });
    };
    return RequestContext;
}());
exports.RequestContext = RequestContext;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/contexts/RequestContext.js.map