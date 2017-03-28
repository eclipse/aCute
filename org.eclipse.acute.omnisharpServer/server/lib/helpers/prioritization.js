"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var normalCommands = [
    'findimplementations', 'findsymbols', 'findusages',
    'gotodefinition', 'typelookup', 'navigateup',
    'navigatedown', 'getcodeactions', 'filesChanged',
    'runcodeaction', 'autocomplete', 'signatureHelp'
];
var priorityCommands = [
    'updatebuffer', 'changebuffer', 'formatAfterKeystroke'
];
var prioritySet = new Set();
var normalSet = new Set();
var deferredSet = new Set();
var undeferredSet = new Set();
lodash_1.each(normalCommands, function (x) {
    normalSet.add(x);
    undeferredSet.add(x);
});
lodash_1.each(priorityCommands, function (x) {
    prioritySet.add(x);
    undeferredSet.add(x);
});
function isPriorityCommand(request) {
    return prioritySet.has(request.command);
}
exports.isPriorityCommand = isPriorityCommand;
function isNormalCommand(request) {
    return !isDeferredCommand(request) && normalSet.has(request.command);
}
exports.isNormalCommand = isNormalCommand;
function isDeferredCommand(request) {
    if (request.silent && !isPriorityCommand(request)) {
        return true;
    }
    if (deferredSet.has(request.command)) {
        return true;
    }
    if (undeferredSet.has(request.command)) {
        return false;
    }
    deferredSet.add(request.command);
    return true;
}
exports.isDeferredCommand = isDeferredCommand;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/prioritization.js.map