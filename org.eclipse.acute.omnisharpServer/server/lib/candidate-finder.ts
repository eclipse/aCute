import { readFileSync } from 'fs';
import { endsWith, filter, findIndex, map, minBy, some, take, trimEnd, trimStart, uniq } from 'lodash';
import { dirname, join, normalize, sep } from 'path';
import { Observable, Scheduler, Subscription } from 'rxjs';
import { Subscribable } from 'rxjs/Observable';
import { CompositeDisposable } from 'ts-disposables';
import { ILogger } from './enums';
import { createObservable } from './operators/create';

// tslint:disable-next-line:no-var-requires no-require-imports
const glob: (file: string[], options?: any) => Promise<string[]> = require('globby');

export interface IOptions {
    solutionFilesToSearch?: string[];
    projectFilesToSearch?: string[];
    sourceFilesToSearch?: string[];
    independentSourceFilesToSearch?: string[];
    maxDepth?: number;
}

export function ifEmpty<T>(observable: Observable<T>, other: Observable<T>) {
    return createObservable<T>(observer => {
        let hasValue = false;
        const cd = new CompositeDisposable();
        cd.add(observable.subscribe(
            value => {
                hasValue = true;
                observer.next(value);
            },
            e => observer.error(e),
            () => {
                if (!hasValue) {
                    cd.add(other.subscribe(
                        value => observer.next(value),
                        e => observer.error(e),
                        () => observer.complete()
                    ));
                } else {
                    observer.complete();
                }
            }
        ));
        return new Subscription(() => cd.dispose());
    });
}

export class Candidate {
    public path: string;
    public originalFile: string;
    public isProject: boolean;

    public constructor(originalFile: string, predicate: (path: string) => boolean) {
        this.originalFile = originalFile = normalize(originalFile);
        this.path = endsWith(originalFile, '.sln') ? originalFile : dirname(originalFile);
        this.isProject = predicate(originalFile);

        Object.freeze(this);
    }

    public toString() {
        return this.path;
    }
}

export const findCandidates = (() => {
    function realFindCandidates(location: string, logger: ILogger, options: IOptions = {}) {
        location = trimEnd(location, sep);

        const solutionFilesToSearch = options.solutionFilesToSearch || (options.solutionFilesToSearch = ['global.json', '*.sln']);
        const projectFilesToSearch = options.projectFilesToSearch || (options.projectFilesToSearch = ['project.json', '*.csproj']);
        const sourceFilesToSearch = options.sourceFilesToSearch || (options.sourceFilesToSearch = ['*.cs']);
        const solutionIndependentSourceFilesToSearch = options.independentSourceFilesToSearch || (options.independentSourceFilesToSearch = ['*.csx']);
        const maxDepth = options.maxDepth || 10;

        const solutionsOrProjects = searchForCandidates(location, solutionFilesToSearch, projectFilesToSearch, maxDepth, logger)
            .toArray()
            .flatMap(result => result.length ? Observable.from(result) : searchForCandidates(location, projectFilesToSearch, [], maxDepth, logger))
            .toArray()
            .map(squashCandidates);

        const independentSourceFiles = searchForCandidates(location, solutionIndependentSourceFilesToSearch, [], maxDepth, logger)
            .toArray();

        const baseFiles = Observable.concat(solutionsOrProjects, independentSourceFiles)
            .flatMap(x => x);

        const sourceFiles = searchForCandidates(location, sourceFilesToSearch, [], maxDepth, logger);

        const predicate = (path: string) => some(solutionFilesToSearch.concat(projectFilesToSearch), pattern => endsWith(path, trimStart(pattern, '*')));

        return ifEmpty(baseFiles, sourceFiles)
            .map(file => new Candidate(file, predicate))
            .distinct(x => x.path)
            .toArray()
            .do(candidates => logger.log(`Omni Project Candidates: Found ${candidates}`));
    }

    function findCandidates(location: string, logger: ILogger, options: IOptions = {}) {
        return realFindCandidates(location, logger, options)
            .map(z => z.map(x => x.toString()));
    }

    (<any>findCandidates).withCandidates = realFindCandidates;

    return <{ (location: string, logger: ILogger, options?: IOptions): Observable<string[]>; withCandidates: typeof realFindCandidates }>findCandidates;
})();

function squashCandidates(candidates: string[]) {
    const rootCandidateCount = getMinCandidate(candidates);
    return uniq(filter(map(candidates, normalize), z => z.split(sep).length === rootCandidateCount));
}

function getMinCandidate(candidates: string[]) {
    if (!candidates.length) {
        return -1;
    }

    return minBy(map(candidates, normalize), z => z.split(sep).length).split(sep).length;
}

function searchForCandidates(location: string, filesToSearch: string[], projectFilesToSearch: string[], maxDepth: number, logger: ILogger): Observable<string> {
    let locations = location.split(sep);
    locations = locations.map((loc, index) => {
        return take(locations, locations.length - index).join(sep);
    });

    locations = locations.slice(0, Math.min(maxDepth, locations.length));

    return Observable.from(locations)
        .subscribeOn(Scheduler.queue)
        .mergeMap(loc => {
            const files = filesToSearch.map(fileName => join(loc, fileName));

            logger.log(`Omni Project Candidates: Searching ${loc} for ${filesToSearch}`);

            return Observable.from(files)
                .flatMap(file => glob([file], { cache: {} }))
                .map(x => {
                    if (x.length > 1) {
                        // Handle the unity project case
                        // Also handle optional solutions that may also exist with the unity ones.
                        const unitySolutionIndex = findIndex(x, z => endsWith(z, '-csharp.sln'));
                        if (unitySolutionIndex > -1) {
                            const unitySolution = x[unitySolutionIndex];
                            const baseSolution = unitySolution.substr(0, unitySolution.indexOf('-csharp.sln')) + '.sln';

                            const baseSolutionIndex = findIndex(x, z => z.toLowerCase() === baseSolution.toLowerCase());
                            if (baseSolutionIndex > -1) {
                                // Remove the index
                                x.splice(baseSolutionIndex, 1);
                            }
                        }
                    }

                    if (some(x, file => endsWith(file, '.sln'))) {
                        return x.filter(file => {
                            const content = readFileSync(file).toString();
                            return some(projectFilesToSearch, path => content.indexOf(trimStart(path, '*')) > -1);
                        });
                    }
                    return x;
                });
        })
        .filter(z => z.length > 0)
        .defaultIfEmpty([])
        .first()
        .flatMap(z => z);
}
