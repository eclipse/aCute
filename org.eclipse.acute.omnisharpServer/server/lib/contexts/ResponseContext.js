"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
// tslint:disable-next-line:no-var-requires no-require-imports
var stripBom = require('strip-bom');
var ResponseContext = (function () {
    function ResponseContext(_a, response, failed) {
        var clientId = _a.clientId, request = _a.request, command = _a.command, sequence = _a.sequence, time = _a.time, silent = _a.silent;
        if (response === void 0) { response = {}; }
        if (failed === void 0) { failed = false; }
        if (command) {
            this.command = command.toLowerCase();
        }
        if (lodash_1.isObject(response)) {
            this.response = Object.freeze(response);
        }
        else {
            this.response = response;
        }
        this.clientId = clientId;
        this.request = request;
        this.command = command;
        this.sequence = sequence;
        this.time = new Date();
        this.silent = !!silent;
        this.failed = !!failed;
        this.responseTime = this.time.getTime() - time.getTime();
        Object.freeze(this);
    }
    ResponseContext.prototype.isCommand = function (command) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    };
    return ResponseContext;
}());
exports.ResponseContext = ResponseContext;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/contexts/ResponseContext.js.map