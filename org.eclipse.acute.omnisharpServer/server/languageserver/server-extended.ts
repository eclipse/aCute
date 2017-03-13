// tslint:disable:interface-name
import { RequestType } from 'vscode-jsonrpc';
import {
    CodeActionContext, Location, NotificationType,
    Position, Range, TextDocumentIdentifier, TextDocumentPositionParams,
    WorkspaceEdit
} from 'vscode-languageserver';

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
    // projects: string[];
}

export type Implementation = Location | Location[];

export interface RunCodeActionParams extends GetCodeActionsParams {
    /**
     * The identifier of the code action to execute
     */
    identifier: string;
}

// tslint:disable:no-mergeable-namespace
export namespace Methods {
    export namespace Extended {
        // tslint:disable:variable-name
        export const GetCodeActionsRequest = '__extended/textDocument/getCodeActions';
        export const RunCodeActionRequest = '__extended/textDocument/runCodeAction';
        export const ImplementationRequest = '__extended/textDocument/implementation';
        export const NavigateRequest = '__extended/textDocument/navigate';
        export const PublishHighlightNotification = '__extended/textDocument/publishHighlight';
        // tslint:enable:variable-name
    }
}

/**
 * A request to rename a symbol.
 */
export namespace GetCodeActionsRequest {
    export const type = new RequestType<GetCodeActionsParams, CodeActionList, void, void>(Methods.Extended.GetCodeActionsRequest);
}

/**
 * A request to rename a symbol.
 */
export namespace RunCodeActionRequest {
    export const type = new RequestType<RunCodeActionParams, WorkspaceEdit, void, void>(Methods.Extended.RunCodeActionRequest);
}

/**
 * A request to find implementation
 */
export namespace ImplementationRequest {
    export const type = new RequestType<TextDocumentPositionParams, Implementation, void, void>(Methods.Extended.ImplementationRequest);
}

/**
 * A request to find implementation
 */
export namespace NavigateRequest {
    export const type = new RequestType<NavigateParams, Position, void, void>(Methods.Extended.NavigateRequest);
}

/**
 * Diagnostics notification are sent from the server to the client to signal
 * results of validation runs.
 */
export namespace HighlightNotification {
    export const type = new NotificationType<PublishHighlightParams, void>(Methods.Extended.PublishHighlightNotification);
}
