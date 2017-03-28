"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var path_1 = require("path");
var rxjs_1 = require("rxjs");
var ts_disposables_1 = require("ts-disposables");
var create_1 = require("./operators/create");
// tslint:disable-next-line:no-var-requires no-require-imports
var glob = require('globby');
function ifEmpty(observable, other) {
    return create_1.createObservable(function (observer) {
        var hasValue = false;
        var cd = new ts_disposables_1.CompositeDisposable();
        cd.add(observable.subscribe(function (value) {
            hasValue = true;
            observer.next(value);
        }, function (e) { return observer.error(e); }, function () {
            if (!hasValue) {
                cd.add(other.subscribe(function (value) { return observer.next(value); }, function (e) { return observer.error(e); }, function () { return observer.complete(); }));
            }
            else {
                observer.complete();
            }
        }));
        return new rxjs_1.Subscription(function () { return cd.dispose(); });
    });
}
exports.ifEmpty = ifEmpty;
var Candidate = (function () {
    function Candidate(originalFile, predicate) {
        this.originalFile = originalFile = path_1.normalize(originalFile);
        this.path = lodash_1.endsWith(originalFile, '.sln') ? originalFile : path_1.dirname(originalFile);
        this.isProject = predicate(originalFile);
        Object.freeze(this);
    }
    Candidate.prototype.toString = function () {
        return this.path;
    };
    return Candidate;
}());
exports.Candidate = Candidate;
exports.findCandidates = (function () {
    function realFindCandidates(location, logger, options) {
        if (options === void 0) { options = {}; }
        location = lodash_1.trimEnd(location, path_1.sep);
        var solutionFilesToSearch = options.solutionFilesToSearch || (options.solutionFilesToSearch = ['global.json', '*.sln']);
        var projectFilesToSearch = options.projectFilesToSearch || (options.projectFilesToSearch = ['project.json', '*.csproj']);
        var sourceFilesToSearch = options.sourceFilesToSearch || (options.sourceFilesToSearch = ['*.cs']);
        var solutionIndependentSourceFilesToSearch = options.independentSourceFilesToSearch || (options.independentSourceFilesToSearch = ['*.csx']);
        var maxDepth = options.maxDepth || 10;
        var solutionsOrProjects = searchForCandidates(location, solutionFilesToSearch, projectFilesToSearch, maxDepth, logger)
            .toArray()
            .flatMap(function (result) { return result.length ? rxjs_1.Observable.from(result) : searchForCandidates(location, projectFilesToSearch, [], maxDepth, logger); })
            .toArray()
            .map(squashCandidates);
        var independentSourceFiles = searchForCandidates(location, solutionIndependentSourceFilesToSearch, [], maxDepth, logger)
            .toArray();
        var baseFiles = rxjs_1.Observable.concat(solutionsOrProjects, independentSourceFiles)
            .flatMap(function (x) { return x; });
        var sourceFiles = searchForCandidates(location, sourceFilesToSearch, [], maxDepth, logger);
        var predicate = function (path) { return lodash_1.some(solutionFilesToSearch.concat(projectFilesToSearch), function (pattern) { return lodash_1.endsWith(path, lodash_1.trimStart(pattern, '*')); }); };
        return ifEmpty(baseFiles, sourceFiles)
            .map(function (file) { return new Candidate(file, predicate); })
            .distinct(function (x) { return x.path; })
            .toArray()
            .do(function (candidates) { return logger.log("Omni Project Candidates: Found " + candidates); });
    }
    function findCandidates(location, logger, options) {
        if (options === void 0) { options = {}; }
        return realFindCandidates(location, logger, options)
            .map(function (z) { return z.map(function (x) { return x.toString(); }); });
    }
    findCandidates.withCandidates = realFindCandidates;
    return findCandidates;
})();
function squashCandidates(candidates) {
    var rootCandidateCount = getMinCandidate(candidates);
    return lodash_1.uniq(lodash_1.filter(lodash_1.map(candidates, path_1.normalize), function (z) { return z.split(path_1.sep).length === rootCandidateCount; }));
}
function getMinCandidate(candidates) {
    if (!candidates.length) {
        return -1;
    }
    return lodash_1.minBy(lodash_1.map(candidates, path_1.normalize), function (z) { return z.split(path_1.sep).length; }).split(path_1.sep).length;
}
function searchForCandidates(location, filesToSearch, projectFilesToSearch, maxDepth, logger) {
    var locations = location.split(path_1.sep);
    locations = locations.map(function (loc, index) {
        return lodash_1.take(locations, locations.length - index).join(path_1.sep);
    });
    locations = locations.slice(0, Math.min(maxDepth, locations.length));
    return rxjs_1.Observable.from(locations)
        .subscribeOn(rxjs_1.Scheduler.queue)
        .mergeMap(function (loc) {
        var files = filesToSearch.map(function (fileName) { return path_1.join(loc, fileName); });
        logger.log("Omni Project Candidates: Searching " + loc + " for " + filesToSearch);
        return rxjs_1.Observable.from(files)
            .flatMap(function (file) { return glob([file], { cache: {} }); })
            .map(function (x) {
            if (x.length > 1) {
                // Handle the unity project case
                // Also handle optional solutions that may also exist with the unity ones.
                var unitySolutionIndex = lodash_1.findIndex(x, function (z) { return lodash_1.endsWith(z, '-csharp.sln'); });
                if (unitySolutionIndex > -1) {
                    var unitySolution = x[unitySolutionIndex];
                    var baseSolution_1 = unitySolution.substr(0, unitySolution.indexOf('-csharp.sln')) + '.sln';
                    var baseSolutionIndex = lodash_1.findIndex(x, function (z) { return z.toLowerCase() === baseSolution_1.toLowerCase(); });
                    if (baseSolutionIndex > -1) {
                        // Remove the index
                        x.splice(baseSolutionIndex, 1);
                    }
                }
            }
            if (lodash_1.some(x, function (file) { return lodash_1.endsWith(file, '.sln'); })) {
                return x.filter(function (file) {
                    var content = fs_1.readFileSync(file).toString();
                    return lodash_1.some(projectFilesToSearch, function (path) { return content.indexOf(lodash_1.trimStart(path, '*')) > -1; });
                });
            }
            return x;
        });
    })
        .filter(function (z) { return z.length > 0; })
        .defaultIfEmpty([])
        .first()
        .flatMap(function (z) { return z; });
}
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/candidate-finder.js.map