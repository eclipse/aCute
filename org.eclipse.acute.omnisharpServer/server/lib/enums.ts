import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { CommandContext } from './contexts/CommandContext';
import { RequestContext } from './contexts/RequestContext';
import { ResponseContext } from './contexts/ResponseContext';

import * as OmniSharp from './omnisharp-server';

export enum DriverState {
    Disconnected,
    Downloading,
    Downloaded,
    //Bootstrapping,
    //Bootstrapped,
    Connecting,
    Connected,
    Error,
}

export enum Runtime {
    ClrOrMono,
    CoreClr,
}

export interface ILogger {
    log(...values: any[]): void;
    error(...values: any[]): void;
}

export interface IDriverCoreOptions {
    projectPath: string;
    remote: boolean;
    debug: boolean; // Start the debug server? (Run from source, to attach with a debug host like VS)
    serverPath: string; // Start a given server, perhaps in a different directory.
    findProject: boolean; // Should try and find the project using the project finder
    logger: ILogger;
    timeout: number; // timeout in seconds
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

export function isPluginDriver(driver: any): driver is IPluginDriver { return !!(<any> driver).updatePlugins; }

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
        }
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

export namespace Omnisharp {
    export interface IEvents {
        events: Observable<OmniSharp.Stdio.Protocol.EventPacket>;
        commands: Observable<OmniSharp.Stdio.Protocol.ResponsePacket>;
        state: Observable<DriverState>;
        status: Observable<IOmnisharpClientStatus>;
        requests: Observable<RequestContext<any>>;
        responses: Observable<ResponseContext<any, any>>;
        errors: Observable<CommandContext<any>>;
    }
}
