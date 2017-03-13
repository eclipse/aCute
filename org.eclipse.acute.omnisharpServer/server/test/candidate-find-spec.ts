// tslint:disable
import { expect } from 'chai';
import { join } from 'path';

import { findCandidates } from '../lib/candidate-finder';

describe('Candidate Finder', () => {
    it('z1 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/cs'), { log: () => { }, error: () => { } }).subscribe((cs) => {
            expect(cs.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/cs')]);
            expect(cs[0].isProject).to.be.false;
            done();
        });
    });

    it('z2 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/cs/'), { log: () => { }, error: () => { } }).subscribe((cs) => {
            expect(cs).to.not.be.null;
            expect(cs.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/cs')]);
            expect(cs[0].isProject).to.be.false;
            done();
        });
    });

    it('z1 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z2 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj/'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z3 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx'), { log: () => { }, error: () => { } }).subscribe((csx) => {
            expect(csx).to.not.be.null;
            expect(csx.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            expect(csx[0].isProject).to.be.false;
            done();
        });
    });

    it('z4 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx/'), { log: () => { }, error: () => { } }).subscribe((csx) => {
            expect(csx).to.not.be.null;
            expect(csx.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            expect(csx[0].isProject).to.be.false;
            done();
        });
    });

    it('z5 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global'), { log: () => { }, error: () => { } }).subscribe((global) => {
            expect(global).to.not.be.null;
            expect(global.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            expect(global[0].isProject).to.be.true;
            done();
        });
    });

    it('z6 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global/'), { log: () => { }, error: () => { } }).subscribe((global) => {
            expect(global).to.not.be.null;
            expect(global.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            expect(global[0].isProject).to.be.true;
            done();
        });
    });

    it('z7 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project'), { log: () => { }, error: () => { } }).subscribe((project) => {
            expect(project).to.not.be.null;
            expect(project.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            expect(project[0].isProject).to.be.true;
            done();
        });
    });

    it('z8 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project/'), { log: () => { }, error: () => { } }).subscribe((project) => {
            expect(project).to.not.be.null;
            expect(project.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            expect(project[0].isProject).to.be.true;
            done();
        });
    });

    it('z9 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution'), { log: () => { }, error: () => { } }).subscribe((solution) => {
            expect(solution).to.not.be.null;
            expect(solution.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution/something.sln')]);
            expect(solution[0].isProject).to.be.true;
            done();
        });
    });

    it('z10 candidate should return root most files', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution/'), { log: () => { }, error: () => { } }).subscribe((solution) => {
            expect(solution).to.not.be.null;
            expect(solution.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution/something.sln')]);
            expect(solution[0].isProject).to.be.true;
            done();
        });
    });

    it('z11 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z12 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/csx'), { log: () => { }, error: () => { } }).subscribe((csx) => {
            expect(csx).to.not.be.null;
            expect(csx.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/global-root-folder'),
                join(__dirname, 'fixture/candidate-finder/global-root-folder/csx')
            ]);
            expect(csx[0].isProject).to.be.true;
            expect(csx[1].isProject).to.be.false;
            done();
        });
    });

    it('z13 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/global'), { log: () => { }, error: () => { } }).subscribe((global) => {
            expect(global).to.not.be.null;
            expect(global.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/global')]);
            expect(global[0].isProject).to.be.true;
            done();
        });
    });

    it('z14 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), { log: () => { }, error: () => { } }).subscribe((project) => {
            expect(project).to.not.be.null;
            expect(project.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            expect(project[0].isProject).to.be.true;
            done();
        });
    });

    it('z15 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/solution'), { log: () => { }, error: () => { } }).subscribe((solution) => {
            expect(solution).to.not.be.null;
            expect(solution.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/solution/something.sln')]);
            expect(solution[0].isProject).to.be.true;
            done();
        });
    });

    it('z16 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx'), { log: () => { }, error: () => { } }).subscribe((csx) => {
            expect(csx).to.not.be.null;
            expect(csx.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx')]);
            expect(csx[0].isProject).to.be.false;
            done();
        });
    });

    it('z17 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'), { log: () => { }, error: () => { } }).subscribe((global) => {
            expect(global).to.not.be.null;
            expect(global.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            ]);
            expect(global[0].isProject).to.be.true;
            expect(global[1].isProject).to.be.false;
            done();
        });
    });

    it('z18 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'), { log: () => { }, error: () => { } }).subscribe((solution) => {
            expect(solution).to.not.be.null;
            expect(solution.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            ]);
            expect(solution[0].isProject).to.be.true;
            expect(solution[1].isProject).to.be.false;
            done();
        });
    });

    it('z19 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z20 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx'), { log: () => { }, error: () => { } }).subscribe((csx) => {
            expect(csx).to.not.be.null;
            expect(csx.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln'),
                join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx')
            ]);
            expect(csx[0].isProject).to.be.true;
            expect(csx[1].isProject).to.be.false;
            done();
        });
    });

    xit('z21 candidate find projects up the folder heirarchy if not found', function (/*done*/) {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/global'), { log: () => { }, error: () => { } }).subscribe((global) => {
            expect(global).to.not.be.null;
            expect(global.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/global')]);
            expect(global[0].isProject).to.be.true;
            // done();
        });
    });

    it('z22 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), { log: () => { }, error: () => { } }).subscribe((project) => {
            expect(project).to.not.be.null;
            expect(project.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln')]);
            expect(project[0].isProject).to.be.true;
            done();
        });
    });

    it('z23 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution'), { log: () => { }, error: () => { } }).subscribe((solution) => {
            expect(solution).to.not.be.null;
            expect(solution.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution/something.sln')]);
            expect(solution[0].isProject).to.be.true;
            done();
        });
    });

    it('z23b candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution'), { log: () => { }, error: () => { } }).subscribe((solution) => {
            expect(solution).to.not.be.null;
            expect(solution.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution/somethingelse.sln'),
            ]);
            expect(solution[0].isProject).to.be.true;
            expect(solution[1].isProject).to.be.true;
            done();
        });
    });

    it('z24 candidate find projects up the folder heirarchy if not found', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/no-solution'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/no-solution')]);
            expect(csproj[0].isProject).to.be.false;
            done();
        });
    });

    it('z25 should return one solution for unity based projects', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/two-solution-unity'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z26 should return two solutions for unity based projects with extra solutions', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/three-solution-unity'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            expect(csproj[0].isProject).to.be.true;
            expect(csproj[1].isProject).to.be.true;
            done();
        });
    });

    it('z27 should return two solutions projects with extra solutions', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/two-solution'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            expect(csproj[0].isProject).to.be.true;
            expect(csproj[1].isProject).to.be.true;
            done();
        });
    });

    it('z28 should return one solution for unity based projects when targeting a folder with a csproj', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/two-solution-unity/csproj'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z28b should return one solution for unity based projects when targeting a folder with a project.json', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/two-solution-unity/project'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            expect(csproj[0].isProject).to.be.true;
            done();
        });
    });

    it('z29 should return two solutions for unity based projects with extra solutions when targeting a folder with a csproj', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/three-solution-unity/csproj'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            expect(csproj[0].isProject).to.be.true;
            expect(csproj[1].isProject).to.be.true;
            done();
        });
    });

    it('z29b should return two solutions for unity based projects with extra solutions when targeting a folder with a project.json', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/three-solution-unity/project'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            expect(csproj[0].isProject).to.be.true;
            expect(csproj[1].isProject).to.be.true;
            done();
        });
    });

    it('z30 should return two solutions projects with extra solutions when targeting a folder with a csproj', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/two-solution/csproj/project'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            expect(csproj[0].isProject).to.be.true;
            expect(csproj[1].isProject).to.be.true;
            done();
        });
    });

    it('z30b should return two solutions projects with extra solutions when targeting a folder with a project.json', (done) => {
        findCandidates.withCandidates(join(__dirname, 'fixture/candidate-finder/two-solution'), { log: () => { }, error: () => { } }).subscribe((csproj) => {
            expect(csproj).to.not.be.null;
            expect(csproj.map((z) => '' + z)).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            expect(csproj[0].isProject).to.be.true;
            expect(csproj[1].isProject).to.be.true;
            done();
        });
    });


});
