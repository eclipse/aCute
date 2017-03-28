"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:interface-name
var vscode_jsonrpc_1 = require("vscode-jsonrpc");
var vscode_languageserver_1 = require("vscode-languageserver");
// tslint:disable:no-mergeable-namespace
var Methods;
(function (Methods) {
    var Extended;
    (function (Extended) {
        // tslint:disable:variable-name
        Extended.GetCodeActionsRequest = '__extended/textDocument/getCodeActions';
        Extended.RunCodeActionRequest = '__extended/textDocument/runCodeAction';
        Extended.ImplementationRequest = '__extended/textDocument/implementation';
        Extended.NavigateRequest = '__extended/textDocument/navigate';
        Extended.PublishHighlightNotification = '__extended/textDocument/publishHighlight';
        // tslint:enable:variable-name
    })(Extended = Methods.Extended || (Methods.Extended = {}));
})(Methods = exports.Methods || (exports.Methods = {}));
/**
 * A request to rename a symbol.
 */
var GetCodeActionsRequest;
(function (GetCodeActionsRequest) {
    GetCodeActionsRequest.type = new vscode_jsonrpc_1.RequestType(Methods.Extended.GetCodeActionsRequest);
})(GetCodeActionsRequest = exports.GetCodeActionsRequest || (exports.GetCodeActionsRequest = {}));
/**
 * A request to rename a symbol.
 */
var RunCodeActionRequest;
(function (RunCodeActionRequest) {
    RunCodeActionRequest.type = new vscode_jsonrpc_1.RequestType(Methods.Extended.RunCodeActionRequest);
})(RunCodeActionRequest = exports.RunCodeActionRequest || (exports.RunCodeActionRequest = {}));
/**
 * A request to find implementation
 */
var ImplementationRequest;
(function (ImplementationRequest) {
    ImplementationRequest.type = new vscode_jsonrpc_1.RequestType(Methods.Extended.ImplementationRequest);
})(ImplementationRequest = exports.ImplementationRequest || (exports.ImplementationRequest = {}));
/**
 * A request to find implementation
 */
var NavigateRequest;
(function (NavigateRequest) {
    NavigateRequest.type = new vscode_jsonrpc_1.RequestType(Methods.Extended.NavigateRequest);
})(NavigateRequest = exports.NavigateRequest || (exports.NavigateRequest = {}));
/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
var HighlightNotification;
(function (HighlightNotification) {
    HighlightNotification.type = new vscode_languageserver_1.NotificationType(Methods.Extended.PublishHighlightNotification);
})(HighlightNotification = exports.HighlightNotification || (exports.HighlightNotification = {}));
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/languageserver/server-extended.js.map