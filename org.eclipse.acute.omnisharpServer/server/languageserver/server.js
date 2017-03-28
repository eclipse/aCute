"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
var lodash_1 = require("lodash");
// import * as _ from 'lodash';
var rxjs_1 = require("rxjs");
var vscode_languageserver_1 = require("vscode-languageserver");
var ReactiveClient_1 = require("../lib/reactive/ReactiveClient");
var omnisharp_client_1 = require("../lib/omnisharp-client");
var create_1 = require("../lib/operators/create");
var server_extended_1 = require("./server-extended");
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 1] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 2] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 3] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 4] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 5] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 6] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 7] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 8] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 9] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 10] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 11] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 12] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 13] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 14] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 15] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 16] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 17] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 18] = "Reference";
})(CompletionItemKind || (CompletionItemKind = {}));
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 1] = "File";
    SymbolKind[SymbolKind["Module"] = 2] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 3] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 4] = "Package";
    SymbolKind[SymbolKind["Class"] = 5] = "Class";
    SymbolKind[SymbolKind["Method"] = 6] = "Method";
    SymbolKind[SymbolKind["Property"] = 7] = "Property";
    SymbolKind[SymbolKind["Field"] = 8] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 9] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 10] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 11] = "Interface";
    SymbolKind[SymbolKind["Function"] = 12] = "Function";
    SymbolKind[SymbolKind["Variable"] = 13] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 14] = "Constant";
    SymbolKind[SymbolKind["String"] = 15] = "String";
    SymbolKind[SymbolKind["Number"] = 16] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 17] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 18] = "Array";
})(SymbolKind || (SymbolKind = {}));
var connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.StreamMessageReader(process.stdin), new vscode_languageserver_1.StreamMessageWriter(process.stdout));
var client;
var OpenEditorManager = (function () {
    function OpenEditorManager() {
        this.openEditors = new Set();
        this._subject = new rxjs_1.Subject();
    }
    OpenEditorManager.prototype.add = function (path) {
        this.openEditors.add(path);
        this._subject.next({
            type: 'add',
            path: path,
        });
    };
    OpenEditorManager.prototype.delete = function (path) {
        this.openEditors.delete(path);
        this._subject.next({
            type: 'delete',
            path: path,
        });
    };
    OpenEditorManager.prototype.has = function (path) {
        return this.openEditors.has(path);
    };
    Object.defineProperty(OpenEditorManager.prototype, "changes", {
        get: function () { return this._subject.asObservable(); },
        enumerable: true,
        configurable: true
    });
    return OpenEditorManager;
}());
var openEditors = new OpenEditorManager();
// tslint:disable-next-line:variable-name
var ExcludeClassifications = [
    7 /* Number */,
    10 /* ExcludedCode */,
    2 /* Comment */,
    3 /* String */,
    5 /* Punctuation */,
    4 /* Operator */,
    6 /* Keyword */,
];
// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
// tslint:disable-next-line:max-func-body-length
connection.onInitialize(function (params) {
    var capabilities = params.capabilities;
    var enablePackageRestore = capabilities.enablePackageRestore === undefined || capabilities.enablePackageRestore;
    var rootPath = params.rootPath;
    if (rootPath == null && params.rootUri != null) {
        rootPath = vscode_languageserver_1.Files.uriToFilePath(params.rootUri);
    }
    client = new ReactiveClient_1.ReactiveClient({
        projectPath: rootPath,
        runtime: omnisharp_client_1.Runtime.ClrOrMono,
        logger: {
            log: function (message) { connection.telemetry.logEvent({ type: 'log', message: message }); },
            error: function (message) { connection.telemetry.logEvent({ type: 'error', message: message }); },
        },
        serverOptions: {
            dotnet: { enablePackageRestore: enablePackageRestore },
        },
    });
    client.observe.diagnostic.subscribe(function (_a) {
        var Results = _a.Results;
        lodash_1.each(Results, function (result) {
            connection.sendDiagnostics({
                uri: toUri(result),
                diagnostics: lodash_1.map(result.QuickFixes, getDiagnostic),
            });
        });
    });
    if (params.capabilities.highlightProvider) {
        var highlightsContext_1 = new Map();
        client.observe.updatebuffer.subscribe(function (context) {
            if (openEditors.has(context.request.FileName)) {
                client.highlight({
                    FileName: context.request.FileName,
                    ExcludeClassifications: ExcludeClassifications,
                });
            }
        });
        client.observe.close.subscribe(function (context) {
            if (highlightsContext_1.has(context.request.FileName)) {
                highlightsContext_1.delete(context.request.FileName);
            }
        });
        client.observe.highlight
            .bufferToggle(client.observe.highlight.throttleTime(100), function () { return rxjs_1.Observable.timer(100); })
            .concatMap(function (items) {
            var highlights = lodash_1.map(lodash_1.uniqBy(lodash_1.reverse(items), function (x) { return x.request.FileName; }), function (context) {
                if (!highlightsContext_1.has(context.request.FileName)) {
                    highlightsContext_1.set(context.request.FileName, []);
                }
                var newHighlights = getHighlights(context.response.Highlights);
                var currentHighlights = highlightsContext_1.get(context.request.FileName);
                var added = lodash_1.differenceBy(newHighlights, currentHighlights, function (x) { return x.id; });
                var removeHighlights = lodash_1.differenceBy(currentHighlights, newHighlights, function (x) { return x.id; });
                highlightsContext_1.set(context.request.FileName, newHighlights);
                return {
                    uri: toUri({ FileName: context.request.FileName }),
                    added: added,
                    removed: lodash_1.map(removeHighlights, function (x) { return x.id; }),
                };
            });
            return rxjs_1.Observable.from(highlights).concatMap(function (x) { return rxjs_1.Observable.of(x).delay(10); });
        })
            .subscribe(function (item) { return connection.sendNotification(server_extended_1.HighlightNotification.type, item); });
    }
    client.observe.events.subscribe(function (event) {
        connection.console.info(JSON.stringify(event));
    });
    client.observe.requests.subscribe(function (event) {
        connection.console.info(JSON.stringify(event));
    });
    client.observe.responses.subscribe(function (event) {
        connection.console.info(JSON.stringify(event));
    });
    /*
     * Little big of magic here
     * This will wait for the server to update all the buffers after a rename operation
     * And then update the diagnostics for all of the buffers.
     */
    client.observe.rename
        .mergeMap(function (rename) {
        return client.observe.updatebuffer
            .debounceTime(1000)
            .take(1)
            .mergeMap(function () {
            // TODO: Add a nicer way to queue many files here to omnisharp...
            return rxjs_1.Observable.merge.apply(rxjs_1.Observable, lodash_1.map(rename.response.Changes, function (item) { return client.diagnostics({ FileName: item.FileName }); }));
        });
    })
        .subscribe();
    client.connect();
    process.on('uncaughtException', function (error) {
        connection.telemetry.logEvent({ type: 'error', message: error });
    });
    return client.state
        .filter(function (x) { return x === omnisharp_client_1.DriverState.Connected; })
        .take(1)
        .do(function () {
        // Kick code checking on.
        client.diagnostics({});
    })
        .map(function () { return ({
        capabilities: {
            //textDocumentSync: TextDocumentSyncKind.Full,
            // Not currently supported
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
            completionProvider: {},
            codeLensProvider: {
                resolveProvider: true,
            },
            definitionProvider: true,
            documentFormattingProvider: true,
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: '}',
                moreTriggerCharacter: [';'],
            },
            documentRangeFormattingProvider: true,
            //documentSymbolProvider: true,
            hoverProvider: true,
            referencesProvider: true,
            renameProvider: true,
            signatureHelpProvider: {
                triggerCharacters: ['('],
            },
            workspaceSymbolProvider: true,
            extended: {
                getCodeActionsProvider: true,
                runCodeActionProvider: true,
                implementationProvider: true,
                navigateProvider: true,
                highlightProvider: true,
            },
        },
    }); })
        .toPromise();
});
connection.onExit(function () {
    client.disconnect();
});
// not yet doing this...
// connection.onDidChangeConfiguration((change) => {
// });
connection.onDidChangeWatchedFiles(function (change) {
    lodash_1.each(change.changes, function (cng) {
        client.updatebuffer({
            FileName: fromUri(cng),
            FromDisk: true,
        });
    });
});
// ** Do we need this yet? **
// connection.onCompletionResolve((item: CompletionItem) => {
// });
var seq = 0;
var textDocumentChanges = create_1.createObservable(function (observer) {
    connection.onDidChangeTextDocument(function (change) {
        observer.next(change);
    });
})
    .share();
var openBuffer = textDocumentChanges
    .filter(function (x) { return !openEditors.has(fromUri(x.textDocument)); })
    .groupBy(function (x) { return fromUri(x.textDocument); })
    .mergeMap(function (group) {
    return group
        .windowWhen(function () { return openEditors.changes
        .filter(function (x) { return x.type === 'add'; })
        .filter(function (x) { return x.path === group.key; })
        .take(1); })
        .concatAll();
});
rxjs_1.Observable.merge(textDocumentChanges
    .filter(function (x) { return openEditors.has(fromUri(x.textDocument)); }), openBuffer)
    .concatMap(function (_a) {
    var textDocument = _a.textDocument, contentChanges = _a.contentChanges;
    // The editor itself might not support TextDocumentSyncKind.Incremental
    // So we check to see if we're getting ranges or not.
    if (contentChanges.length === 1 && !contentChanges[0].range) {
        // TextDocumentSyncKind.Full
        return client.updatebuffer({
            FileName: fromUri(textDocument),
            Buffer: contentChanges[0].text,
        });
    }
    else if (contentChanges.length > 0) {
        // TextDocumentSyncKind.Incremental
        var changes = lodash_1.map(contentChanges, function (change) {
            return ({
                NewText: change.text,
                FileName: fromUri(textDocument),
                StartColumn: change.range.start.character,
                StartLine: change.range.start.line,
                EndColumn: change.range.end.character,
                EndLine: change.range.end.line,
            });
        });
        return client.updatebuffer({
            FileName: fromUri(textDocument),
            Changes: changes,
        });
    }
    return rxjs_1.Observable.empty();
})
    .subscribe();
connection.onDidOpenTextDocument(function (_a) {
    var textDocument = _a.textDocument;
    client.open({
        FileName: fromUri(textDocument),
    }).concatMap(function () {
        return client.updatebuffer({
            FileName: fromUri(textDocument),
            Buffer: textDocument.text,
        });
    })
        .subscribe(function () {
        openEditors.add(fromUri(textDocument));
    });
});
connection.onDidCloseTextDocument(function (_a) {
    var textDocument = _a.textDocument;
    client.close({
        FileName: fromUri(textDocument),
    });
    openEditors.delete(fromUri(textDocument));
});
connection.onDidSaveTextDocument(function (_a) {
    var textDocument = _a.textDocument;
    client.updatebuffer({
        FileName: fromUri(textDocument),
        FromDisk: true,
    });
});
connection.onDefinition(function (_a) {
    var textDocument = _a.textDocument, position = _a.position;
    return client.gotodefinition({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line,
    })
        .map(getLocationPoint)
        .toPromise();
});
connection.onCompletion(function (_a) {
    var textDocument = _a.textDocument, position = _a.position;
    return client
        .autocomplete({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line,
        WantDocumentationForEveryCompletionResult: true,
        WantKind: true,
        WantImportableTypes: true,
        // WantMethodHeader: true,
        WantReturnType: true,
        WantSnippet: false,
        WordToComplete: '',
    })
        .map(function (x) { return lodash_1.map(x, function (value) {
        return {
            label: value.DisplayText,
            detail: value.Description,
            documentation: value.MethodHeader,
            filterText: value.CompletionText,
            kind: CompletionItemKind[value.Kind],
            sortText: value.DisplayText,
        };
    }); })
        .map(function (items) { return ({
        isIncomplete: false, items: items,
    }); })
        .toPromise();
});
//connection.onCompletionResolve((x) => {});
connection.onHover(function (_a) {
    var textDocument = _a.textDocument, position = _a.position;
    return client.typelookup({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line,
    })
        .map(function (result) { return ({
        contents: (result.Type || '') + " " + (result.Documentation || ''),
    }); })
        .toPromise();
});
connection.onSignatureHelp(function (_a) {
    var textDocument = _a.textDocument, position = _a.position;
    return client.signatureHelp({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line,
    })
        .map(function (result) { return ({
        activeParameter: result.ActiveParameter,
        activeSignature: result.ActiveSignature,
        signatures: lodash_1.map(result.Signatures, function (z) { return ({
            documentation: z.Documentation,
            label: z.Label,
            parameters: lodash_1.map(z.Parameters, function (param) { return ({
                documentation: param.Documentation,
                label: param.Label,
            }); }),
        }); }),
    }); })
        .toPromise();
});
connection.onReferences(function (_a) {
    var context = _a.context, textDocument = _a.textDocument, position = _a.position;
    return client.findusages({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line,
        ExcludeDefinition: !context.includeDeclaration,
    })
        .map(function (result) { return lodash_1.map(result.QuickFixes, getLocation); })
        .toPromise();
});
//connection.onDocumentHighlight((x) => {});
//connection.onDocumentSymbol((x) => {});
connection.onWorkspaceSymbol(function (_a) {
    var query = _a.query;
    return client.findsymbols({ Filter: query })
        .map(function (results) { return lodash_1.map(results.QuickFixes, function (fix) { return ({
        kind: SymbolKind[fix.Kind] || SymbolKind.Variable,
        name: fix.Text,
        location: getLocation(fix),
    }); }); })
        .toPromise();
});
connection.onCodeLens(function (_a) {
    var textDocument = _a.textDocument;
    return client.currentfilemembersasflat({
        FileName: fromUri(textDocument),
    })
        .map(function (results) {
        return lodash_1.map(results, function (location) {
            return {
                data: lodash_1.defaults({ FileName: fromUri(textDocument) }, location),
                range: getRange(location),
            };
        });
    })
        .toPromise();
});
connection.onCodeLensResolve(function (codeLens) {
    return client.findusages(codeLens.data)
        .map(function (x) {
        codeLens.command = {
            // TODO: ...?
            title: "References (" + x.QuickFixes.length + ")",
            command: "references",
        };
        codeLens.data = {
            location: getLocation(codeLens.data),
        };
        return codeLens;
    })
        .toPromise();
});
// Requires new endpoint
connection.onDocumentFormatting(function (_a) {
    var textDocument = _a.textDocument, options = _a.options;
    return client.codeformat({
        WantsTextChanges: true,
        FileName: fromUri(textDocument),
    })
        .map(getTextEdits)
        .toPromise();
});
connection.onDocumentRangeFormatting(function (_a) {
    var textDocument = _a.textDocument, options = _a.options, range = _a.range;
    return client.formatRange({
        FileName: fromUri(textDocument),
        Column: range.start.character,
        Line: range.start.line,
        EndColumn: range.end.character,
        EndLine: range.end.line,
    })
        .map(getTextEdits)
        .toPromise();
});
connection.onDocumentOnTypeFormatting(function (_a) {
    var textDocument = _a.textDocument, options = _a.options, position = _a.position, ch = _a.ch;
    return client.formatAfterKeystroke({
        FileName: fromUri(textDocument),
        Character: ch,
        Line: position.line,
        Column: position.character,
    })
        .map(getTextEdits)
        .toPromise();
});
connection.onRenameRequest(function (context) {
    return client.rename({
        FileName: fromUri(context.textDocument),
        Line: context.position.line,
        Column: context.position.character,
        RenameTo: context.newName,
        ApplyTextChanges: false,
        WantsTextChanges: true,
    })
        .map(toWorkspaceEdit)
        .toPromise();
});
/* EXTENDED ENDPOINTS */
connection.onRequest(server_extended_1.GetCodeActionsRequest.type, function (_a) {
    var textDocument = _a.textDocument, range = _a.range, context = _a.context;
    return client.getcodeactions({
        FileName: fromUri(textDocument),
        Selection: fromRange(range),
    })
        .map(function (item) {
        var codeActions = lodash_1.map(item.CodeActions, function (codeAction) {
            return {
                name: codeAction.Name,
                identifier: codeAction.Identifier,
            };
        });
        return { codeActions: codeActions };
    })
        .toPromise();
});
connection.onRequest(server_extended_1.RunCodeActionRequest.type, function (_a) {
    var textDocument = _a.textDocument, range = _a.range, context = _a.context, identifier = _a.identifier;
    return client.runcodeaction({
        FileName: fromUri(textDocument),
        Selection: fromRange(range),
        Identifier: identifier,
        WantsTextChanges: true,
        ApplyTextChanges: false,
    })
        .map(toWorkspaceEdit)
        .toPromise();
});
connection.onRequest(server_extended_1.ImplementationRequest.type, function (_a) {
    var textDocument = _a.textDocument, position = _a.position;
    return client.findimplementations({
        FileName: fromUri(textDocument),
        Column: position.character,
        Line: position.line,
    })
        .map(function (z) { return z.QuickFixes; })
        .map(getLocationPoints)
        .toPromise();
});
connection.onRequest(server_extended_1.NavigateRequest.type, function (params) {
    var request = (params.direction === 'up' ?
        client.navigateup({
            FileName: fromUri(params.textDocument),
            Column: params.position.character,
            Line: params.position.line,
        })
        :
            client.navigatedown({
                FileName: fromUri(params.textDocument),
                Column: params.position.character,
                Line: params.position.line,
            }));
    return request
        .map(getPosition)
        .toPromise();
});
// Listen on the connection
connection.listen();
function getRange(item) {
    return {
        start: {
            character: item.Column || item.StartColumn || 0,
            line: item.Line || item.StartLine || 0,
        },
        end: {
            character: item.EndColumn,
            line: item.EndLine,
        },
    };
}
function getHighlights(highlights) {
    return lodash_1.map(highlights, getHighlight);
}
function getHighlight(highlight) {
    var range = getRange(highlight);
    return {
        id: range.start.line + ":" + range.start.character + "|" + range.end.line + ":" + range.end.character + "|" + highlight.Kind,
        range: range,
        kind: highlight.Kind,
    };
}
function getLocationPoints(fix) {
    return lodash_1.map(fix, getLocationPoint);
}
function getLocationPoint(fix) {
    return getLocation(lodash_1.assign(fix, { EndColumn: fix.Column, EndLine: fix.Line }));
}
function getLocation(fix) {
    return {
        uri: toUri(fix),
        range: getRange(fix),
    };
}
function getPosition(model) {
    return vscode_languageserver_1.Position.create(model.Line, model.Column);
}
function getTextEdit(change) {
    return {
        range: getRange(change),
        newText: change.NewText,
    };
}
function getTextEdits(response) {
    return lodash_1.map(response.Changes, getTextEdit);
}
function getDiagnostic(item) {
    var sev = vscode_languageserver_1.DiagnosticSeverity.Error;
    if (item.LogLevel === 'Warning') {
        sev = vscode_languageserver_1.DiagnosticSeverity.Warning;
    }
    if (item.LogLevel === 'Hidden') {
        sev = vscode_languageserver_1.DiagnosticSeverity.Hint;
    }
    if (item.LogLevel === 'Information') {
        sev = vscode_languageserver_1.DiagnosticSeverity.Information;
    }
    return {
        severity: sev,
        message: item.Text,
        range: getRange(item),
    };
}
function fromUri(document) {
    return vscode_languageserver_1.Files.uriToFilePath(document.uri);
}
function fromRange(range) {
    return {
        Start: {
            Column: range.start.character,
            Line: range.start.line,
        },
        End: {
            Column: range.end.character,
            Line: range.end.line,
        },
    };
}
function toUri(result) {
    return toUriString(result.FileName);
}
function toWorkspaceEdit(item) {
    var changes = lodash_1.map(lodash_1.groupBy(item.Changes, function (x) { return x.FileName; }), function (result, key) {
        return vscode_languageserver_1.TextDocumentEdit.create(
        // TODO: Version?
        vscode_languageserver_1.VersionedTextDocumentIdentifier.create(toUriString(key), 0), lodash_1.flatMap(result, function (i) { return lodash_1.map(i.Changes, getTextEdit); }));
    });
    return { changes: changes };
}
// TODO: this code isn't perfect
function toUriString(path) {
    return "file://" + (process.platform === 'win32' ? '/' : '') + path.replace(':', encodeURIComponent(':'));
}
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/languageserver/server.js.map