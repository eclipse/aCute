// tslint:disable-next-line:max-file-line-count
import { expect } from 'chai';
import { ReactiveClient as OmnisharpClient } from '../lib/reactive/ReactiveClient';

let server: OmnisharpClient;

describe('Commands', () => {
    beforeEach(() => {
        server = new OmnisharpClient({
            projectPath: process.cwd()
        });
    });

    describe('updatebuffer', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.updatebuffer({
                    FileName: null!,
                    Buffer: ''
                });
            }).to.throw(/must not be null/);
        });
    });

    describe('changebuffer', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.changebuffer({
                    FileName: null!,
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if NewText is null', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: null!,
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if StartLine is null', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: null!,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if StartLine is less than 0', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: -1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if StartColumn is null', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: null!,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if StartColumn is less than 0', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: -1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if EndLine is null', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: null!,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndLine is less than 0', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: -1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if EndColumn is null', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndColumn is less than 0', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.not.throw;
        });
    });

    describe('codecheck', () => {
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.codecheck({});
            }).to.not.throw;
        });
    });

    describe('formatAfterKeystroke', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    Character: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: null!,
                    Column: 1,
                    Character: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Character: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: 1,
                    Column: null!,
                    Character: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Character: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });

        it('should throw if Character && Char is null', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    Character: null!,
                    Char: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    Character: '',
                    Char: null!
                });
            }).to.not.throw;
        });
    });


    describe('formatRange', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.formatRange({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: null!,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: null!,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if EndLine is null', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: null!,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndLine is less than 0', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: -1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if EndColumn is null', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndColumn is less than 0', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.not.throw;
        });
    });

    describe('codeformat', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.codeformat({
                    FileName: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.codeformat({
                    FileName: null!
                });
            }).to.not.throw;
        });
    });

    describe('autocomplete', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.autocomplete({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    WordToComplete: '',
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: null!,
                    Column: 1,
                    WordToComplete: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    WordToComplete: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: null!,
                    WordToComplete: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    WordToComplete: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if WordToComplete is null', () => {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    WordToComplete: null!,
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.autocomplete({
                    FileName: null!
                });
            }).to.not.throw;
        });
    });

    describe('metadata', () => {
        it('should throw if AssemblyName is null', () => {
            expect(() => {
                server.metadata({
                    Language: 'C#',
                    AssemblyName: null!,
                    TypeName: '',
                    Timeout: 0,
                    ProjectName: '',
                    VersionNumber: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if TypeName is null', () => {
            expect(() => {
                server.metadata({
                    Language: 'C#',
                    AssemblyName: '',
                    TypeName: null!,
                    Timeout: 0,
                    ProjectName: '',
                    VersionNumber: ''
                });
            }).to.throw(/must not be null/);
        });
    });

    describe('findimplementations', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.findimplementations({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('findsymbols', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.findsymbols({
                    Filter: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.findsymbols({
                    Filter: ''
                });
            }).to.not.throw;
        });
    });

    describe('findusages', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.findusages({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('gotodefinition', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.gotodefinition({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('navigateup', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.navigateup({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('navigatedown', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.navigatedown({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('rename', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.rename({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: null!,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: null!,
                    RenameTo: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    RenameTo: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if RenameTo is null', () => {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    RenameTo: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.not.throw;
        });
    });

    describe('signatureHelp', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.signatureHelp({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('typelookup', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.typelookup({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });

    describe('getcodeactions', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: null!,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: null!,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
        it('should throw if Selection.Start.Line is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        Start: {
                            Line: null!,
                            Column: 1
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.Start.Line is less than 0', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        Start: {
                            Line: -1,
                            Column: 1
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Selection.Start.Column is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        Start: {
                            Line: 1,
                            Column: null!
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.Start.Column is less than 0', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        Start: {
                            Line: 1,
                            Column: -1
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Selection.End.Line is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: null!,
                            Column: 1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.End.Line is less than 0', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: -1,
                            Column: 1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Selection.End.Column is null', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: null!
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.End.Column is less than 0', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: -1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: 1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.not.throw;
        });
    });

    describe('checkalivestatus', () => {
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.checkalivestatus();
            }).to.not.throw;
        });
    });

    describe('checkreadystatus', () => {
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.checkreadystatus();
            }).to.not.throw;
        });
    });

    describe('currentfilemembersastree', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.currentfilemembersastree({
                    FileName: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.currentfilemembersastree({
                    FileName: ''
                });
            }).to.not.throw;
        });
    });

    describe('currentfilemembersasflat', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.currentfilemembersasflat({
                    FileName: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.currentfilemembersasflat({
                    FileName: ''
                });
            }).to.not.throw;
        });
    });

    describe('filesChanged', () => {
        it('should throw if request is null', () => {
            expect(() => {
                server.filesChanged(null!);
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.filesChanged([]);
            }).to.not.throw;
        });
    });

    describe('projects', () => {
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.projects({});
            }).to.not.throw;
        });
    });

    describe('project', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.project({
                    FileName: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.project({
                    FileName: ''
                });
            }).to.not.throw;
        });
    });

    describe('runcodeaction', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    Identifier: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: null!,
                    Column: 1,
                    Identifier: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Identifier: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: null!,
                    Identifier: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Identifier: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Identifier is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Identifier: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Identifier: ''
                });
            }).to.not.throw;
        });
        it('should throw if Selection.Start.Line is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        Start: {
                            Line: null!,
                            Column: 1
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.Start.Line is less than 0', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        Start: {
                            Line: -1,
                            Column: 1
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Selection.Start.Column is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        Start: {
                            Line: 1,
                            Column: null!
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.Start.Column is less than 0', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        Start: {
                            Line: 1,
                            Column: -1
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Selection.End.Line is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: null!,
                            Column: 1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.End.Line is less than 0', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: -1,
                            Column: 1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Selection.End.Column is null', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: null!
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.End.Column is less than 0', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: -1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: -1
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.not.throw;
        });
    });

    describe('gettestcontext', () => {
        it('should throw if FileName is null', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: null!,
                    Line: 1,
                    Column: 1,
                    Type: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: null!,
                    Column: 1,
                    Type: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Type: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: null!,
                    Type: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Type: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Type is null', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: null!
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Type is less than 0', () => {
            expect(() => {
                server.gettestcontext(<any>{
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', () => {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: 1
                });
            }).to.not.throw;
        });
    });
});
