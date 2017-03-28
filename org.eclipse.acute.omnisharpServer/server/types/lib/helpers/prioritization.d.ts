import { RequestContext } from '../contexts/RequestContext';
export declare function isPriorityCommand(request: RequestContext<any>): boolean;
export declare function isNormalCommand(request: RequestContext<any>): boolean;
export declare function isDeferredCommand(request: RequestContext<any>): boolean;
