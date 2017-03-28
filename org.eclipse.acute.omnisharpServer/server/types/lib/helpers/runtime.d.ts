import { Observable } from 'rxjs';
import { ILogger, Runtime } from '../enums';
import { SupportedPlatform } from './platform';
export interface IRuntimeContext {
    runtime: Runtime;
    platform: string;
    arch: string;
    bootstrap?: boolean;
    version?: string;
    destination?: string;
}
export declare class RuntimeContext {
    private _logger;
    private _runtime;
    private _platform;
    private _arch;
    private _bootstrap;
    private _version;
    private _destination;
    private _id;
    private _key;
    private _os;
    private _location;
    constructor(runtimeContext: IRuntimeContext, _logger?: ILogger);
    readonly runtime: Runtime;
    readonly platform: SupportedPlatform;
    readonly arch: string;
    readonly bootstrap: string;
    readonly version: string;
    readonly destination: string;
    readonly id: string;
    readonly location: string;
    findRuntime(location?: string): Observable<string>;
    downloadRuntime(): Observable<string[]>;
    downloadRuntimeIfMissing(): Observable<{} | string[]>;
    downloadFile(url: string, path: string): Observable<void>;
    private _getIdKey();
    private _getOsName();
    private _getRuntimeLocation();
    private _checkCurrentVersion();
    private _ensureCurrentVersion();
    private _downloadSpecificRuntime(name);
    private _extract(win32, path, dest);
}
export declare const isSupportedRuntime: ((ctx: RuntimeContext) => Observable<{
    runtime: Runtime;
    path: any;
}>) & {
    cache: {
        delete(key: string): boolean;
        get(key: string): any;
        has(key: string): boolean;
        set(key: string, value: any): any;
    };
};
export declare function findRuntimeById(runtimeId: string, location: string): Observable<string>;
