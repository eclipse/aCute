"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
var chai_1 = require("chai");
var ReactiveClient_1 = require("../lib/reactive/ReactiveClient");
var server;
describe('Commands', function () {
    beforeEach(function () {
        server = new ReactiveClient_1.ReactiveClient({
            projectPath: process.cwd()
        });
    });
    describe('updatebuffer', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.updatebuffer({
                    FileName: null,
                    Buffer: ''
                });
            }).to.throw(/must not be null/);
        });
    });
    describe('changebuffer', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.changebuffer({
                    FileName: null,
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if NewText is null', function () {
            chai_1.expect(function () {
                server.changebuffer({
                    FileName: '',
                    NewText: null,
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if StartLine is null', function () {
            chai_1.expect(function () {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: null,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if StartLine is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if StartColumn is null', function () {
            chai_1.expect(function () {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: null,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if StartColumn is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if EndLine is null', function () {
            chai_1.expect(function () {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: null,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndLine is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if EndColumn is null', function () {
            chai_1.expect(function () {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndColumn is less than 0', function () {
            chai_1.expect(function () {
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
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
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
    describe('codecheck', function () {
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.codecheck({});
            }).to.not.throw;
        });
    });
    describe('formatAfterKeystroke', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Character: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    Character: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Character: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    Character: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Character: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Character && Char is null', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Character: null,
                    Char: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.formatAfterKeystroke({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Character: '',
                    Char: null
                });
            }).to.not.throw;
        });
    });
    describe('formatRange', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    EndLine: 1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if EndLine is null', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: null,
                    EndColumn: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndLine is less than 0', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: -1,
                    EndColumn: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if EndColumn is null', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if EndColumn is less than 0', function () {
            chai_1.expect(function () {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
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
    describe('codeformat', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.codeformat({
                    FileName: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.codeformat({
                    FileName: null
                });
            }).to.not.throw;
        });
    });
    describe('autocomplete', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    WordToComplete: '',
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    WordToComplete: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    WordToComplete: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    WordToComplete: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    WordToComplete: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if WordToComplete is null', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    WordToComplete: null,
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.autocomplete({
                    FileName: null
                });
            }).to.not.throw;
        });
    });
    describe('metadata', function () {
        it('should throw if AssemblyName is null', function () {
            chai_1.expect(function () {
                server.metadata({
                    Language: 'C#',
                    AssemblyName: null,
                    TypeName: '',
                    Timeout: 0,
                    ProjectName: '',
                    VersionNumber: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if TypeName is null', function () {
            chai_1.expect(function () {
                server.metadata({
                    Language: 'C#',
                    AssemblyName: '',
                    TypeName: null,
                    Timeout: 0,
                    ProjectName: '',
                    VersionNumber: ''
                });
            }).to.throw(/must not be null/);
        });
    });
    describe('findimplementations', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.findimplementations({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.findimplementations({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.findimplementations({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('findsymbols', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.findsymbols({
                    Filter: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.findsymbols({
                    Filter: ''
                });
            }).to.not.throw;
        });
    });
    describe('findusages', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.findusages({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.findusages({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.findusages({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('gotodefinition', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.gotodefinition({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.gotodefinition({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.gotodefinition({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('navigateup', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.navigateup({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.navigateup({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.navigateup({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('navigatedown', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.navigatedown({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.navigatedown({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.navigatedown({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('rename', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    RenameTo: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    RenameTo: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if RenameTo is null', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    RenameTo: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    RenameTo: ''
                });
            }).to.not.throw;
        });
    });
    describe('signatureHelp', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.signatureHelp({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.signatureHelp({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.signatureHelp({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('typelookup', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.typelookup({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.typelookup({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.typelookup({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
    });
    describe('getcodeactions', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: null,
                    Line: 1,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Line: null,
                    Column: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Line: -1,
                    Column: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: 1
                });
            }).to.not.throw;
        });
        it('should throw if Selection.Start.Line is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        Start: {
                            Line: null,
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
        it('should throw if Selection.Start.Line is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if Selection.Start.Column is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        Start: {
                            Line: 1,
                            Column: null
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.Start.Column is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if Selection.End.Line is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: null,
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
        it('should throw if Selection.End.Line is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if Selection.End.Column is null', function () {
            chai_1.expect(function () {
                server.getcodeactions({
                    FileName: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: null
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.End.Column is less than 0', function () {
            chai_1.expect(function () {
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
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
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
    describe('checkalivestatus', function () {
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.checkalivestatus();
            }).to.not.throw;
        });
    });
    describe('checkreadystatus', function () {
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.checkreadystatus();
            }).to.not.throw;
        });
    });
    describe('currentfilemembersastree', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.currentfilemembersastree({
                    FileName: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.currentfilemembersastree({
                    FileName: ''
                });
            }).to.not.throw;
        });
    });
    describe('currentfilemembersasflat', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.currentfilemembersasflat({
                    FileName: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.currentfilemembersasflat({
                    FileName: ''
                });
            }).to.not.throw;
        });
    });
    describe('filesChanged', function () {
        it('should throw if request is null', function () {
            chai_1.expect(function () {
                server.filesChanged(null);
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.filesChanged([]);
            }).to.not.throw;
        });
    });
    describe('projects', function () {
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.projects({});
            }).to.not.throw;
        });
    });
    describe('project', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.project({
                    FileName: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.project({
                    FileName: ''
                });
            }).to.not.throw;
        });
    });
    describe('runcodeaction', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Identifier: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    Identifier: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Identifier: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    Identifier: ''
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Identifier: ''
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Identifier is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Identifier: null
                });
            }).to.throw(/must not be null/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Identifier: ''
                });
            }).to.not.throw;
        });
        it('should throw if Selection.Start.Line is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        Start: {
                            Line: null,
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
        it('should throw if Selection.Start.Line is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if Selection.Start.Column is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        Start: {
                            Line: 1,
                            Column: null
                        },
                        End: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.Start.Column is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if Selection.End.Line is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: null,
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
        it('should throw if Selection.End.Line is less than 0', function () {
            chai_1.expect(function () {
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
        it('should throw if Selection.End.Column is null', function () {
            chai_1.expect(function () {
                server.runcodeaction({
                    FileName: '',
                    Identifier: '',
                    Selection: {
                        End: {
                            Line: 1,
                            Column: null
                        },
                        Start: {
                            Line: 1,
                            Column: 1
                        }
                    }
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Selection.End.Column is less than 0', function () {
            chai_1.expect(function () {
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
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
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
    describe('gettestcontext', function () {
        it('should throw if FileName is null', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Type: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is null', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    Type: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Line is less than 0', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Type: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Column is null', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    Type: 1
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Column is less than 0', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Type: 1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should throw if Type is null', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: null
                });
            }).to.throw(/must not be null/);
        });
        it('should throw if Type is less than 0', function () {
            chai_1.expect(function () {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: -1
                });
            }).to.throw(/must be greater than or equal to 0/);
        });
        it('should not throw of required fields are set', function () {
            chai_1.expect(function () {
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
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/test/reactive-client-commands.js.map