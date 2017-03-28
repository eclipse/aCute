import { ICoreClientOptions } from './enums';
export declare function ensureClientOptions(options: ICoreClientOptions): void;
export declare function flattenArguments<T extends {
    [index: string]: any;
}>(obj: T, prefix?: string): any[];
