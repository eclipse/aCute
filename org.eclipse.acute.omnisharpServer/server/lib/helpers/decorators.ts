import { startsWith } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { ResponseContext } from '../contexts/ResponseContext';
import * as OmniSharp from '../omnisharp-server';

export function getInternalKey(path: string) {
    return `__${path}__`.toLowerCase();
}

export function getInternalValue(context: any, path: string) {
    return context[getInternalKey(path)];
}

export function setEventOrResponse(context: any, path: string) {
    const instance = context._client || context;
    const isEvent = !startsWith(path, '/');
    const internalKey = getInternalKey(path);
    if (isEvent) {
        const eventKey = path[0].toUpperCase() + path.substr(1);
        context[internalKey] = (<Observable<OmniSharp.Stdio.Protocol.EventPacket>>instance._eventsStream)
            .filter(x => x.Event === eventKey)
            .map(x => x.Body)
            .share();
    } else {
        const stream: Subject<ResponseContext<any, any>> = instance._getResponseStream(path);
        context[internalKey] = stream.asObservable()
            .filter(x => !x.silent);
    }
    return context[internalKey];
}

export function setMergeOrAggregate(context: any, path: string) {
    const internalKey = getInternalKey(path);
    const method = (c: any) => c.observe[path] || c[path];
    if (!context[internalKey]) {
        const value = context.makeObservable(method);
        context[internalKey] = value;
    }
    return context[internalKey];
}

export function request(target: Object, propertyKey: string) {
    const descriptor: TypedPropertyDescriptor<any> = {};
    const version = OmniSharp.Api.getVersion(propertyKey);
    let format = (name: string) => `/${name}`;
    if (version !== 'v1') {
        format = name => `/${version}/${name}`;
    }

    const name = format(propertyKey);
    descriptor.value = function (
        this: {
            _fixup: (propery: string, request: OmniSharp.Models.Request, options: any) => any;
            request: (name: string, request: OmniSharp.Models.Request, options: any) => any;
        },
        request: OmniSharp.Models.Request,
        options: any) {
        if (request && (<any>request).silent) {
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

export function response(target: Object, propertyKey: string, path: string) {
    const descriptor: TypedPropertyDescriptor<any> = {};
    const internalKey = getInternalKey(path);
    descriptor.get = function (this: { [index: string]: any; }) {
        if (!this[internalKey]) {
            setEventOrResponse(this, path);
        }

        return this[internalKey];
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, propertyKey, descriptor);
}

export function event(target: Object, path: string) {
    const descriptor: TypedPropertyDescriptor<any> = {};
    const internalKey = getInternalKey(path);
    descriptor.get = function (this: { [index: string]: any; }) {
        if (!this[internalKey]) {
            setEventOrResponse(this, path);
        }

        return this[internalKey];
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, path, descriptor);
}

export function makeObservable(target: Object, propertyKey: string, path: string) {
    const descriptor: TypedPropertyDescriptor<any> = {};
    const internalKey = getInternalKey(path);
    const method = (c: any) => c.observe[propertyKey] || c[propertyKey];
    descriptor.get = function (this: { [index: string]: any; makeObservable: (method: Function) => any; }) {
        if (!this[internalKey]) {
            const value = this.makeObservable(method);
            this[internalKey] = value;
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
    Object.defineProperty(target, propertyKey, descriptor);
}

export function reference(target: Object, propertyKey: string, path: string) {
    const descriptor: TypedPropertyDescriptor<any> = {};
    descriptor.get = function (this: { [index: string]: any; _client: { [index: string]: any; } }) { return this._client[propertyKey]; };
    Object.defineProperty(target, propertyKey, descriptor);
}
