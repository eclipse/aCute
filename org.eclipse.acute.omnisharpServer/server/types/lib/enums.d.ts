import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { CommandContext } from './contexts/CommandContext';
import { RequestContext } from './contexts/RequestContext';
import { ResponseContext } from './contexts/ResponseContext';
import * as OmniSharp from './omnisharp-server';
export declare enum DriverState {
    Disconnected = 0,
    Downloading = 1,
    Downloaded = 2,
    Connecting = 3,
    Connected = 4,
    Error = 5,
}
export declare enum Runtime {
    ClrOrMono = 0,
    CoreClr = 1,
}
export interface ILogger {
    log(...values: any[]): void;
    error(...values: any[]): void;
}
export interface IDriverCoreOptions {
    projectPath: string;
    remote: boolean;
    debug: boolean;
    serverPath: string;
    findProject: boolean;
    logger: ILogger;
    timeout: number;
    runtime: Runtime;
    additionalArguments: string[];
    plugins: IOmnisharpPlugin[];
    version: string;
}
export interface IDriverOptions extends IDriverCoreOptions {
    onEvent: (event: OmniSharp.Stdio.Protocol.EventPacket) => void;
    onCommand: (event: OmniSharp.Stdio.Protocol.ResponsePacket) => void;
    onState: (state: DriverState) => void;
}
export interface IDriver extends IDisposable {
    id: string;
    currentState: DriverState;
    serverPath: string;
    projectPath: string;
    runtime: Runtime;
    connect(): void;
    disconnect(): void;
}
export interface IAsyncDriver extends IDriver {
    request<TRequest, TResponse>(command: string, request?: TRequest): PromiseLike<TResponse>;
    onEvent(callback: (event: OmniSharp.Stdio.Protocol.EventPacket) => void): IDisposable;
    onState(callback: (state: DriverState) => void): IDisposable;
}
export interface IReactiveDriver extends IDriver {
    events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
    state: Observable<DriverState>;
    request<TRequest, TResponse>(command: string, request?: TRequest): Observable<TResponse>;
}
export interface IPluginDriver extends IDriver {
    updatePlugins(plugins: IOmnisharpPlugin): void;
}
export declare function isPluginDriver(driver: any): driver is IPluginDriver;
export interface ICoreClientOptions extends IDriverCoreOptions {
    statusSampleTime: number;
    responseSampleTime: number;
    concurrency: number;
    concurrencyTimeout: number;
    serverOptions: {
        dotnet?: {
            alias?: string;
            projects?: string;
            enablePackageRestore?: boolean;
            packageRestoreTimeout?: number;
        };
        formattingOptions?: {
            newLine?: string;
            useTabs?: boolean;
            tabSize?: number;
            indentationSize?: number;
        };
    };
}
export interface IAsyncClientOptions extends ICoreClientOptions {
    driver: (options: IDriverOptions) => IAsyncDriver;
}
export interface IReactiveClientOptions extends ICoreClientOptions {
    driver: (options: IDriverOptions) => IReactiveDriver;
}
export interface IOmnisharpPlugin {
    name?: string;
    version?: string;
    location?: string;
}
export interface IOmnisharpClientStatus {
    state: DriverState;
    outgoingRequests: number;
    hasOutgoingRequests: boolean;
}
export declare namespace Omnisharp {
    interface IEvents {
        events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Observable<DriverState>;
        status: Observable<IOmnisharpClientStatus>;
        requests: Observable<RequestContext<any>>;
        responses: Observable<ResponseContext<any, any>>;
        errors: Observable<CommandContext<any>>;
    }
}
