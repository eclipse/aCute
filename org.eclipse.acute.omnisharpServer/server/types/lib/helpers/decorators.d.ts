export declare function getInternalKey(path: string): string;
export declare function getInternalValue(context: any, path: string): any;
export declare function setEventOrResponse(context: any, path: string): any;
export declare function setMergeOrAggregate(context: any, path: string): any;
export declare function request(target: Object, propertyKey: string): void;
export declare function response(target: Object, propertyKey: string, path: string): void;
export declare function event(target: Object, path: string): void;
export declare function makeObservable(target: Object, propertyKey: string, path: string): void;
export declare function reference(target: Object, propertyKey: string, path: string): void;
