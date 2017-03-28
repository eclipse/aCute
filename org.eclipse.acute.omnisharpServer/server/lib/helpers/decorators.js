"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var OmniSharp = require("../omnisharp-server");
function getInternalKey(path) {
    return ("__" + path + "__").toLowerCase();
}
exports.getInternalKey = getInternalKey;
function getInternalValue(context, path) {
    return context[getInternalKey(path)];
}
exports.getInternalValue = getInternalValue;
function setEventOrResponse(context, path) {
    var instance = context._client || context;
    var isEvent = !lodash_1.startsWith(path, '/');
    var internalKey = getInternalKey(path);
    if (isEvent) {
        var eventKey_1 = path[0].toUpperCase() + path.substr(1);
        context[internalKey] = instance._eventsStream
            .filter(function (x) { return x.Event === eventKey_1; })
            .map(function (x) { return x.Body; })
            .share();
    }
    else {
        var stream = instance._getResponseStream(path);
        context[internalKey] = stream.asObservable()
            .filter(function (x) { return !x.silent; });
    }
    return context[internalKey];
}
exports.setEventOrResponse = setEventOrResponse;
function setMergeOrAggregate(context, path) {
    var internalKey = getInternalKey(path);
    var method = function (c) { return c.observe[path] || c[path]; };
    if (!context[internalKey]) {
        var value = context.makeObservable(method);
        context[internalKey] = value;
    }
    return context[internalKey];
}
exports.setMergeOrAggregate = setMergeOrAggregate;
function request(target, propertyKey) {
    var descriptor = {};
    var version = OmniSharp.Api.getVersion(propertyKey);
    var format = function (name) { return "/" + name; };
    if (version !== 'v1') {
        format = function (name) { return "/" + version + "/" + name; };
    }
    var name = format(propertyKey);
    descriptor.value = function (request, options) {
        if (request && request.silent) {
            options = request;
            request = {};
        }
        options = options || {};
        this._fixup(propertyKey, request, options);
        return this.request(name, request, options);
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, propertyKey, descriptor);
}
exports.request = request;
function response(target, propertyKey, path) {
    var descriptor = {};
    var internalKey = getInternalKey(path);
    descriptor.get = function () {
        if (!this[internalKey]) {
            setEventOrResponse(this, path);
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, propertyKey, descriptor);
}
exports.response = response;
function event(target, path) {
    var descriptor = {};
    var internalKey = getInternalKey(path);
    descriptor.get = function () {
        if (!this[internalKey]) {
            setEventOrResponse(this, path);
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, path, descriptor);
}
exports.event = event;
function makeObservable(target, propertyKey, path) {
    var descriptor = {};
    var internalKey = getInternalKey(path);
    var method = function (c) { return c.observe[propertyKey] || c[propertyKey]; };
    descriptor.get = function () {
        if (!this[internalKey]) {
            var value = this.makeObservable(method);
            this[internalKey] = value;
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, propertyKey, descriptor);
}
exports.makeObservable = makeObservable;
function reference(target, propertyKey, path) {
    var descriptor = {};
    descriptor.get = function () { return this._client[propertyKey]; };
    Object.defineProperty(target, propertyKey, descriptor);
}
exports.reference = reference;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/decorators.js.map