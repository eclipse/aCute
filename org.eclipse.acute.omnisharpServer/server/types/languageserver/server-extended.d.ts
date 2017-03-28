import { RequestType } from 'vscode-jsonrpc';
import { CodeActionContext, Location, NotificationType, Position, Range, TextDocumentIdentifier, TextDocumentPositionParams, WorkspaceEdit } from 'vscode-languageserver';
export interface ExtendedServerCapabilities {
    extended: {
        getCodeActionsProvider?: boolean;
        runCodeActionProvider?: boolean;
        implementationProvider?: boolean;
        navigateProvider?: boolean;
        highlightProvider?: boolean;
    };
}
export interface ClientCapabilities {
    highlightProvider?: boolean;
    enablePackageRestore?: boolean;
}
export interface GetCodeActionsParams {
    /**
     * The document in which the command was invoked.
     */
    textDocument: TextDocumentIdentifier;
    /**
     * The range for which the command was invoked.
     */
    range: Range;
    /**
     * Context carrying additional information.
     */
    context: CodeActionContext;
}
export interface NavigateParams extends TextDocumentPositionParams {
    direction: 'up' | 'down';
}
export interface CodeActionList {
    codeActions: CodeAction[];
}
export interface CodeAction {
    name: string;
    identifier: string;
}
export interface PublishHighlightParams {
    uri: string;
    added: Highlight[];
    removed: string[];
}
export interface Highlight {
    id: string;
    range: Range;
    kind: string;
}
export declare type Implementation = Location | Location[];
export interface RunCodeActionParams extends GetCodeActionsParams {
    /**
     * The identifier of the code action to execute
     */
    identifier: string;
}
export declare namespace Methods {
    namespace Extended {
        const GetCodeActionsRequest = "__extended/textDocument/getCodeActions";
        const RunCodeActionRequest = "__extended/textDocument/runCodeAction";
        const ImplementationRequest = "__extended/textDocument/implementation";
        const NavigateRequest = "__extended/textDocument/navigate";
        const PublishHighlightNotification = "__extended/textDocument/publishHighlight";
    }
}
/**
 * A request to rename a symbol.
 */
export declare namespace GetCodeActionsRequest {
    const type: RequestType<GetCodeActionsParams, CodeActionList, void, void>;
}
/**
 * A request to rename a symbol.
 */
export declare namespace RunCodeActionRequest {
    const type: RequestType<RunCodeActionParams, WorkspaceEdit, void, void>;
}
/**
 * A request to find implementation
 */
export declare namespace ImplementationRequest {
    const type: RequestType<TextDocumentPositionParams, Implementation, void, void>;
}
/**
 * A request to find implementation
 */
export declare namespace NavigateRequest {
    const type: RequestType<NavigateParams, Position, void, void>;
}
/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
export declare namespace HighlightNotification {
    const type: NotificationType<PublishHighlightParams, void>;
}
