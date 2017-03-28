import { Observable } from 'rxjs';
import { IDisposable } from 'ts-disposables';
import { IOmnisharpPlugin } from '../enums';
export declare class PluginManager implements IDisposable {
    private _disposable;
    private _pluginsChanged;
    private _currentBootstrap;
    private _observePluginsChanged;
    readonly changed: Observable<any>;
    private _plugins;
    readonly plugins: Set<IOmnisharpPlugin>;
    constructor(plugins: IOmnisharpPlugin[]);
    add(plugin: IOmnisharpPlugin): void;
    remove(plugin: IOmnisharpPlugin): void;
    dispose(): void;
}
