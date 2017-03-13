/// <reference path="typings/globals/node/index.d.ts" />
/// <reference path="typings/modules/lodash/index.d.ts" />

declare module chai {
    interface Assert {
        isAbove(valueToCheck: number, valueToBeAbove: number, message?: string): void;
    }
}

declare interface Thenable<T> {
    then(resolve: (value: T) => void, reject?: (error: any) => void): Thenable<T>;
}
