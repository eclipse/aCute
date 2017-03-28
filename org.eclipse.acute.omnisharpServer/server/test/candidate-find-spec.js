"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
var chai_1 = require("chai");
var path_1 = require("path");
var candidate_finder_1 = require("../lib/candidate-finder");
describe('Candidate Finder', function () {
    it('z1 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/cs'), { log: function () { }, error: function () { } }).subscribe(function (cs) {
            chai_1.expect(cs.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/cs')]);
            chai_1.expect(cs[0].isProject).to.be.false;
            done();
        });
    });
    it('z2 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/cs/'), { log: function () { }, error: function () { } }).subscribe(function (cs) {
            chai_1.expect(cs).to.not.be.null;
            chai_1.expect(cs.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/cs')]);
            chai_1.expect(cs[0].isProject).to.be.false;
            done();
        });
    });
    it('z1 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csproj'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z2 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csproj/'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z3 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csx'), { log: function () { }, error: function () { } }).subscribe(function (csx) {
            chai_1.expect(csx).to.not.be.null;
            chai_1.expect(csx.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            chai_1.expect(csx[0].isProject).to.be.false;
            done();
        });
    });
    it('z4 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csx/'), { log: function () { }, error: function () { } }).subscribe(function (csx) {
            chai_1.expect(csx).to.not.be.null;
            chai_1.expect(csx.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            chai_1.expect(csx[0].isProject).to.be.false;
            done();
        });
    });
    it('z5 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/global'), { log: function () { }, error: function () { } }).subscribe(function (global) {
            chai_1.expect(global).to.not.be.null;
            chai_1.expect(global.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            chai_1.expect(global[0].isProject).to.be.true;
            done();
        });
    });
    it('z6 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/global/'), { log: function () { }, error: function () { } }).subscribe(function (global) {
            chai_1.expect(global).to.not.be.null;
            chai_1.expect(global.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            chai_1.expect(global[0].isProject).to.be.true;
            done();
        });
    });
    it('z7 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/project'), { log: function () { }, error: function () { } }).subscribe(function (project) {
            chai_1.expect(project).to.not.be.null;
            chai_1.expect(project.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            chai_1.expect(project[0].isProject).to.be.true;
            done();
        });
    });
    it('z8 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/project/'), { log: function () { }, error: function () { } }).subscribe(function (project) {
            chai_1.expect(project).to.not.be.null;
            chai_1.expect(project.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            chai_1.expect(project[0].isProject).to.be.true;
            done();
        });
    });
    it('z9 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/solution'), { log: function () { }, error: function () { } }).subscribe(function (solution) {
            chai_1.expect(solution).to.not.be.null;
            chai_1.expect(solution.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/solution/something.sln')]);
            chai_1.expect(solution[0].isProject).to.be.true;
            done();
        });
    });
    it('z10 candidate should return root most files', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/same-folder/solution/'), { log: function () { }, error: function () { } }).subscribe(function (solution) {
            chai_1.expect(solution).to.not.be.null;
            chai_1.expect(solution.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/same-folder/solution/something.sln')]);
            chai_1.expect(solution[0].isProject).to.be.true;
            done();
        });
    });
    it('z11 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z12 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder/csx'), { log: function () { }, error: function () { } }).subscribe(function (csx) {
            chai_1.expect(csx).to.not.be.null;
            chai_1.expect(csx.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder'),
                path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder/csx')
            ]);
            chai_1.expect(csx[0].isProject).to.be.true;
            chai_1.expect(csx[1].isProject).to.be.false;
            done();
        });
    });
    it('z13 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder/global'), { log: function () { }, error: function () { } }).subscribe(function (global) {
            chai_1.expect(global).to.not.be.null;
            chai_1.expect(global.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder/global')]);
            chai_1.expect(global[0].isProject).to.be.true;
            done();
        });
    });
    it('z14 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder'), { log: function () { }, error: function () { } }).subscribe(function (project) {
            chai_1.expect(project).to.not.be.null;
            chai_1.expect(project.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            chai_1.expect(project[0].isProject).to.be.true;
            done();
        });
    });
    it('z15 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder/solution'), { log: function () { }, error: function () { } }).subscribe(function (solution) {
            chai_1.expect(solution).to.not.be.null;
            chai_1.expect(solution.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/global-root-folder/solution/something.sln')]);
            chai_1.expect(solution[0].isProject).to.be.true;
            done();
        });
    });
    it('z16 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx'), { log: function () { }, error: function () { } }).subscribe(function (csx) {
            chai_1.expect(csx).to.not.be.null;
            chai_1.expect(csx.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx')]);
            chai_1.expect(csx[0].isProject).to.be.false;
            done();
        });
    });
    it('z17 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'), { log: function () { }, error: function () { } }).subscribe(function (global) {
            chai_1.expect(global).to.not.be.null;
            chai_1.expect(global.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
                path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            ]);
            chai_1.expect(global[0].isProject).to.be.true;
            chai_1.expect(global[1].isProject).to.be.false;
            done();
        });
    });
    it('z18 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'), { log: function () { }, error: function () { } }).subscribe(function (solution) {
            chai_1.expect(solution).to.not.be.null;
            chai_1.expect(solution.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution/something.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            ]);
            chai_1.expect(solution[0].isProject).to.be.true;
            chai_1.expect(solution[1].isProject).to.be.false;
            done();
        });
    });
    it('z19 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z20 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx'), { log: function () { }, error: function () { } }).subscribe(function (csx) {
            chai_1.expect(csx).to.not.be.null;
            chai_1.expect(csx.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx')
            ]);
            chai_1.expect(csx[0].isProject).to.be.true;
            chai_1.expect(csx[1].isProject).to.be.false;
            done();
        });
    });
    xit('z21 candidate find projects up the folder heirarchy if not found', function () {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/global'), { log: function () { }, error: function () { } }).subscribe(function (global) {
            chai_1.expect(global).to.not.be.null;
            chai_1.expect(global.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/global')]);
            chai_1.expect(global[0].isProject).to.be.true;
            // done();
        });
    });
    it('z22 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder'), { log: function () { }, error: function () { } }).subscribe(function (project) {
            chai_1.expect(project).to.not.be.null;
            chai_1.expect(project.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln')]);
            chai_1.expect(project[0].isProject).to.be.true;
            done();
        });
    });
    it('z23 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution'), { log: function () { }, error: function () { } }).subscribe(function (solution) {
            chai_1.expect(solution).to.not.be.null;
            chai_1.expect(solution.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution/something.sln')]);
            chai_1.expect(solution[0].isProject).to.be.true;
            done();
        });
    });
    it('z23b candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution'), { log: function () { }, error: function () { } }).subscribe(function (solution) {
            chai_1.expect(solution).to.not.be.null;
            chai_1.expect(solution.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution/something.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution/somethingelse.sln'),
            ]);
            chai_1.expect(solution[0].isProject).to.be.true;
            chai_1.expect(solution[1].isProject).to.be.true;
            done();
        });
    });
    it('z24 candidate find projects up the folder heirarchy if not found', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/no-solution'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/no-solution')]);
            chai_1.expect(csproj[0].isProject).to.be.false;
            done();
        });
    });
    it('z25 should return one solution for unity based projects', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/two-solution-unity'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z26 should return two solutions for unity based projects with extra solutions', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            chai_1.expect(csproj[1].isProject).to.be.true;
            done();
        });
    });
    it('z27 should return two solutions projects with extra solutions', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/two-solution'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            chai_1.expect(csproj[1].isProject).to.be.true;
            done();
        });
    });
    it('z28 should return one solution for unity based projects when targeting a folder with a csproj', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/two-solution-unity/csproj'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z28b should return one solution for unity based projects when targeting a folder with a project.json', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/two-solution-unity/project'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([path_1.join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            done();
        });
    });
    it('z29 should return two solutions for unity based projects with extra solutions when targeting a folder with a csproj', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/csproj'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            chai_1.expect(csproj[1].isProject).to.be.true;
            done();
        });
    });
    it('z29b should return two solutions for unity based projects with extra solutions when targeting a folder with a project.json', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/project'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            chai_1.expect(csproj[1].isProject).to.be.true;
            done();
        });
    });
    it('z30 should return two solutions projects with extra solutions when targeting a folder with a csproj', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/two-solution/csproj/project'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            chai_1.expect(csproj[1].isProject).to.be.true;
            done();
        });
    });
    it('z30b should return two solutions projects with extra solutions when targeting a folder with a project.json', function (done) {
        candidate_finder_1.findCandidates.withCandidates(path_1.join(__dirname, 'fixture/candidate-finder/two-solution'), { log: function () { }, error: function () { } }).subscribe(function (csproj) {
            chai_1.expect(csproj).to.not.be.null;
            chai_1.expect(csproj.map(function (z) { return '' + z; })).to.be.deep.equal([
                path_1.join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                path_1.join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            chai_1.expect(csproj[0].isProject).to.be.true;
            chai_1.expect(csproj[1].isProject).to.be.true;
            done();
        });
    });
});
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/candidate-find-spec.js.map