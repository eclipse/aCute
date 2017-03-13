import { each } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { CompositeDisposable, IDisposable } from 'ts-disposables';
import { IOmnisharpPlugin } from '../enums';

export class PluginManager implements IDisposable {
    private _disposable = new CompositeDisposable();
    private _pluginsChanged = new Subject<any>();
    private _currentBootstrap: string | null = null;

    private _observePluginsChanged = this._pluginsChanged.debounceTime(1000);
    public get changed() { return this._observePluginsChanged; }

    private _plugins = new Set<IOmnisharpPlugin>();
    public get plugins() { return this._plugins; }

    public constructor(plugins: IOmnisharpPlugin[]) {
        each(plugins, plugin => {
            this._plugins.add(plugin);
        });
        this._disposable.add(this._pluginsChanged.subscribe(() => this._currentBootstrap = null));
    }

    public add(plugin: IOmnisharpPlugin) {
        this._plugins.add(plugin);
        this._pluginsChanged.next(true);
    }

    public remove(plugin: IOmnisharpPlugin) {
        this._plugins.delete(plugin);
        this._pluginsChanged.next(true);
    }

    public dispose() {
        this._disposable.dispose();
    }
}
