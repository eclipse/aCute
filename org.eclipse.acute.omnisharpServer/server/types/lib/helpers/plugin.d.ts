import { Observable } from 'rxjs';
import { ILogger, IOmnisharpPlugin } from '../enums';
import { RuntimeContext } from './runtime';
export declare function getPluginPath(solutionLocation: string, ctx: RuntimeContext, requestedPlugins: IOmnisharpPlugin[], logger: ILogger): Observable<string>;
