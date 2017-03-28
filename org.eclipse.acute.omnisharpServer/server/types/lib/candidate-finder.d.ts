import { Observable } from 'rxjs';
import { ILogger } from './enums';
export interface IOptions {
    solutionFilesToSearch?: string[];
    projectFilesToSearch?: string[];
    sourceFilesToSearch?: string[];
    independentSourceFilesToSearch?: string[];
    maxDepth?: number;
}
export declare function ifEmpty<T>(observable: Observable<T>, other: Observable<T>): Observable<T>;
export declare class Candidate {
    path: string;
    originalFile: string;
    isProject: boolean;
    constructor(originalFile: string, predicate: (path: string) => boolean);
    toString(): string;
}
export declare const findCandidates: {
    (location: string, logger: ILogger, options?: IOptions | undefined): Observable<string[]>;
    withCandidates: (location: string, logger: ILogger, options?: IOptions) => Observable<Candidate[]>;
};
