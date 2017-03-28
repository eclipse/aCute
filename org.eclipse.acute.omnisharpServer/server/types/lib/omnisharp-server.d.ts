import { Observable } from "rxjs";
export declare module Models {
    const enum HighlightClassification {
        Name = 1,
        Comment = 2,
        String = 3,
        Operator = 4,
        Punctuation = 5,
        Keyword = 6,
        Number = 7,
        Identifier = 8,
        PreprocessorKeyword = 9,
        ExcludedCode = 10,
    }
    interface SyntaxFeature {
        Name: string;
        Data: string;
    }
    interface AutoCompleteRequest extends Models.Request {
        WordToComplete?: string;
        WantDocumentationForEveryCompletionResult?: boolean;
        WantImportableTypes?: boolean;
        WantMethodHeader?: boolean;
        WantSnippet?: boolean;
        WantReturnType?: boolean;
        WantKind?: boolean;
    }
    interface Request {
        Line?: number;
        Column?: number;
        Buffer?: string;
        Changes?: Models.LinePositionSpanTextChange[];
        FileName?: string;
    }
    interface LinePositionSpanTextChange {
        NewText: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
    }
    interface AutoCompleteResponse {
        CompletionText: string;
        Description: string;
        DisplayText: string;
        RequiredNamespaceImport: string;
        MethodHeader: string;
        ReturnType: string;
        Snippet: string;
        Kind: string;
    }
    interface ChangeBufferRequest {
        FileName?: string;
        StartLine?: number;
        StartColumn?: number;
        EndLine?: number;
        EndColumn?: number;
        NewText?: string;
    }
    interface CodeActionRequest extends Models.Request {
        CodeAction?: number;
        WantsTextChanges?: boolean;
        SelectionStartColumn?: number;
        SelectionStartLine?: number;
        SelectionEndColumn?: number;
        SelectionEndLine?: number;
    }
    interface CodeCheckRequest extends Models.Request {
    }
    interface CodeFormatRequest extends Models.Request {
        WantsTextChanges?: boolean;
    }
    interface CodeFormatResponse {
        Buffer: string;
        Changes: Models.LinePositionSpanTextChange[];
    }
    interface DiagnosticLocation extends Models.QuickFix {
        LogLevel: string;
    }
    interface QuickFix {
        FileName: string;
        Line: number;
        Column: number;
        EndLine: number;
        EndColumn: number;
        Text: string;
        Projects: string[];
    }
    interface DiagnosticMessage {
        Results: Models.DiagnosticResult[];
    }
    interface DiagnosticResult {
        FileName: string;
        QuickFixes: Models.DiagnosticLocation[];
    }
    interface DiagnosticsRequest extends Models.Request {
    }
    interface DiagnosticsResponse {
    }
    interface ErrorMessage {
        Text: string;
        FileName: string;
        Line: number;
        Column: number;
    }
    interface EventTypes {
    }
    interface FileCloseRequest extends Models.Request {
    }
    interface FileCloseResponse {
    }
    interface FileMemberElement {
        ChildNodes: Models.FileMemberElement[];
        Location: Models.QuickFix;
        Kind: string;
        Features: Models.SyntaxFeature[];
        Projects: string[];
    }
    interface FileMemberTree {
        TopLevelTypeDefinitions: Models.FileMemberElement[];
    }
    interface FileOpenRequest extends Models.Request {
    }
    interface FileOpenResponse {
    }
    interface FilesChangedRequest {
    }
    interface FilesChangedResponse {
    }
    interface FindImplementationsRequest extends Models.Request {
    }
    interface FindSymbolsRequest {
        Language?: string;
        Filter?: string;
    }
    interface FindUsagesRequest extends Models.Request {
        OnlyThisFile?: boolean;
        ExcludeDefinition?: boolean;
    }
    interface FixUsingsRequest extends Models.Request {
        WantsTextChanges?: boolean;
        ApplyTextChanges?: boolean;
    }
    interface FixUsingsResponse {
        Buffer: string;
        AmbiguousResults: Models.QuickFix[];
        Changes: Models.LinePositionSpanTextChange[];
    }
    interface FormatAfterKeystrokeRequest extends Models.Request {
        Character?: string;
        Char?: string;
    }
    interface FormatRangeRequest extends Models.Request {
        EndLine?: number;
        EndColumn?: number;
    }
    interface FormatRangeResponse {
        Changes: Models.LinePositionSpanTextChange[];
    }
    interface GetCodeActionRequest extends Models.CodeActionRequest {
    }
    interface GetCodeActionsResponse {
        CodeActions: string[];
    }
    interface GetTestCommandResponse {
        Directory: string;
        TestCommand: string;
    }
    interface GotoDefinitionRequest extends Models.Request {
        Timeout?: number;
        WantMetadata?: boolean;
    }
    interface GotoDefinitionResponse {
        FileName: string;
        Line: number;
        Column: number;
        MetadataSource: Models.MetadataSource;
    }
    interface MetadataSource {
        AssemblyName: string;
        TypeName: string;
        ProjectName: string;
        VersionNumber: string;
        Language: string;
    }
    interface GotoFileRequest extends Models.Request {
    }
    interface GotoRegionRequest extends Models.Request {
    }
    interface HighlightSpan {
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
        Kind: string;
        Projects: string[];
    }
    interface HighlightRequest extends Models.Request {
        Lines?: number[];
        ProjectNames?: string[];
        Classifications?: Models.HighlightClassification[];
        ExcludeClassifications?: Models.HighlightClassification[];
    }
    interface HighlightResponse {
        Highlights: Models.HighlightSpan[];
    }
    interface MembersFlatRequest extends Models.Request {
    }
    interface MembersTreeRequest extends Models.Request {
    }
    interface MetadataRequest extends Models.MetadataSource {
        Timeout?: number;
    }
    interface MetadataResponse {
        SourceName: string;
        Source: string;
    }
    interface ModifiedFileResponse {
        FileName: string;
        Buffer: string;
        Changes: Models.LinePositionSpanTextChange[];
    }
    interface NavigateDownRequest extends Models.Request {
    }
    interface NavigateResponse {
        Line: number;
        Column: number;
    }
    interface NavigateUpRequest extends Models.Request {
    }
    interface PackageDependency {
        Name: string;
        Version: string;
    }
    interface PackageRestoreMessage {
        FileName: string;
        Succeeded: boolean;
    }
    interface PackageSearchItem {
        Id: string;
        HasVersion: boolean;
        Version: string;
        Description: string;
    }
    interface PackageSearchRequest {
        ProjectPath?: string;
        Sources?: string[];
        Search?: string;
        SupportedFrameworks?: string[];
        IncludePrerelease?: boolean;
        PackageTypes?: string[];
    }
    interface PackageSearchResponse {
        Packages: Models.PackageSearchItem[];
    }
    interface PackageSourceRequest {
        ProjectPath?: string;
    }
    interface PackageSourceResponse {
        Sources: string[];
    }
    interface PackageVersionRequest {
        ProjectPath?: string;
        Sources?: string[];
        Id?: string;
        IncludePrerelease?: boolean;
    }
    interface PackageVersionResponse {
        Versions: string[];
    }
    interface QuickFixResponse {
        QuickFixes: Models.QuickFix[];
    }
    interface RenameRequest extends Models.Request {
        WantsTextChanges?: boolean;
        ApplyTextChanges?: boolean;
        RenameTo?: string;
    }
    interface RenameResponse {
        Changes: Models.ModifiedFileResponse[];
        ErrorMessage: string;
    }
    interface RunCodeActionRequest extends Models.CodeActionRequest {
    }
    interface RunCodeActionResponse {
        Text: string;
        Changes: Models.LinePositionSpanTextChange[];
    }
    interface SignatureHelp {
        Signatures: Models.SignatureHelpItem[];
        ActiveSignature: number;
        ActiveParameter: number;
    }
    interface SignatureHelpItem {
        Name: string;
        Label: string;
        Documentation: string;
        Parameters: Models.SignatureHelpParameter[];
    }
    interface SignatureHelpParameter {
        Name: string;
        Label: string;
        Documentation: string;
    }
    interface SignatureHelpRequest extends Models.Request {
    }
    interface SymbolLocation extends Models.QuickFix {
        Kind: string;
    }
    interface TestCommandRequest extends Models.Request {
        Type?: TestCommandType;
    }
    interface TestCommandResponse {
        TestCommand: string;
    }
    interface TypeLookupRequest extends Models.Request {
        IncludeDocumentation?: boolean;
    }
    interface TypeLookupResponse {
        Type: string;
        Documentation: string;
    }
    interface UnresolvedDependenciesMessage {
        FileName: string;
        UnresolvedDependencies: Models.PackageDependency[];
    }
    interface UpdateBufferRequest extends Models.Request {
        FromDisk?: boolean;
    }
}
export declare module Models.V2 {
    interface OmniSharpCodeAction {
        Identifier: string;
        Name: string;
    }
    interface GetCodeActionsRequest extends Models.Request {
        Selection?: Models.V2.Range;
    }
    interface Range {
        Start: Models.V2.Point;
        End: Models.V2.Point;
    }
    interface Point {
        Line: number;
        Column: number;
    }
    interface GetCodeActionsResponse {
        CodeActions: Models.V2.OmniSharpCodeAction[];
    }
    interface ICodeActionRequest {
        Line?: number;
        Column?: number;
        Buffer?: string;
        FileName?: string;
        Selection?: Models.V2.Range;
    }
    interface RunCodeActionRequest extends Models.Request {
        Identifier?: string;
        Selection?: Models.V2.Range;
        WantsTextChanges?: boolean;
        ApplyTextChanges?: boolean;
    }
    interface RunCodeActionResponse {
        Changes: Models.ModifiedFileResponse[];
    }
}
export declare module Models.v1 {
    interface ProjectInformationRequest extends Models.Request {
    }
    interface WorkspaceInformationRequest {
        ExcludeSourceFiles?: boolean;
    }
}
export declare module Models {
    interface DotNetConfiguration {
        Name: string;
        CompilationOutputPath: string;
        CompilationOutputAssemblyFile: string;
        CompilationOutputPdbFile: string;
        EmitEntryPoint: boolean;
    }
    interface DotNetFramework {
        Name: string;
        FriendlyName: string;
        ShortName: string;
    }
    interface DotNetProjectInformation {
        Path: string;
        Name: string;
        ProjectSearchPaths: string[];
        Configurations: Models.DotNetConfiguration[];
        Frameworks: Models.DotNetFramework[];
        SourceFiles: string[];
    }
    interface DotNetWorkspaceInformation {
        Projects: Models.DotNetProjectInformation[];
        RuntimePath: string;
    }
    interface MSBuildDiagnosticsMessage {
        LogLevel: string;
        FileName: string;
        Text: string;
        StartLine: number;
        StartColumn: number;
        EndLine: number;
        EndColumn: number;
    }
    interface MSBuildProject {
        ProjectGuid: string;
        Path: string;
        AssemblyName: string;
        TargetPath: string;
        TargetFramework: string;
        SourceFiles: string[];
    }
    interface MSBuildProjectDiagnostics {
        FileName: string;
        Warnings: Models.MSBuildDiagnosticsMessage[];
        Errors: Models.MSBuildDiagnosticsMessage[];
    }
    interface MsBuildWorkspaceInformation {
        SolutionPath: string;
        Projects: Models.MSBuildProject[];
    }
}
export declare module Roslyn.Models {
    interface ReferenceModel {
        Id: string;
        Display: string;
        FullPath: string;
        Aliases: string[];
        Kind: string;
    }
    interface ProjectInfoModel {
        FilePath: string;
        AssemblyName: string;
        Name: string;
        Language: string;
        AnalyzerReferences: Roslyn.Models.ReferenceModel[];
        MetadataReferences: Roslyn.Models.ReferenceModel[];
        ProjectReferences: Roslyn.Models.ReferenceModel[];
    }
}
export declare module Stdio.Protocol {
    interface EventPacket extends Stdio.Protocol.Packet {
        Event: string;
        Body: any;
    }
    interface Packet {
        Seq: number;
        Type?: string;
    }
    interface RequestPacket extends Stdio.Protocol.Packet {
        Command: string;
        Arguments: any;
    }
    interface ResponsePacket extends Stdio.Protocol.Packet {
        Request_seq: number;
        Command: string;
        Running: boolean;
        Success: boolean;
        Message: string;
        Body: any;
    }
}
export declare module ScriptCs {
    interface ScriptCsContextModel {
        CsxFilesBeingProcessed: string[];
        CsxFileProjects: {
            [key: string]: {
                [key: string]: Roslyn.Models.ProjectInfoModel;
            };
        };
        CsxReferences: {
            [key: string]: Roslyn.Models.ReferenceModel[];
        };
        CsxLoadReferences: {
            [key: string]: Roslyn.Models.ProjectInfoModel[];
        };
        CsxUsings: {
            [key: string]: string[];
        };
        ScriptPacks: string[];
        CommonReferences: Roslyn.Models.ReferenceModel[];
        CommonUsings: string[];
        RootPath: string;
    }
}
export declare const enum TestCommandType {
    All = 0,
    Fixture = 1,
    Single = 2,
}
export interface Context<TRequest, TResponse> {
    request: TRequest;
    response: TResponse;
}
export interface RequestOptions {
    silent?: boolean;
}
export interface CombinationKey<T> {
    key: string;
    value: T;
}
export declare module Api {
    interface Common {
        request(path: string, options?: RequestOptions): Observable<any>;
        request(path: string, request?: any, options?: RequestOptions): Observable<any>;
        request(path: "/autocomplete", request: Models.AutoCompleteRequest, options?: RequestOptions): Observable<Models.AutoCompleteResponse[]>;
        request(path: "/changebuffer", request: Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        request(path: "/checkalivestatus", options?: RequestOptions): Observable<boolean>;
        request(path: "/checkreadystatus", options?: RequestOptions): Observable<boolean>;
        request(path: "/close", request: Models.FileCloseRequest, options?: RequestOptions): Observable<Models.FileCloseResponse>;
        request(path: "/codecheck", request: Models.CodeCheckRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/codeformat", request: Models.CodeFormatRequest, options?: RequestOptions): Observable<Models.CodeFormatResponse>;
        request(path: "/currentfilemembersasflat", request: Models.MembersFlatRequest, options?: RequestOptions): Observable<Models.QuickFix[]>;
        request(path: "/currentfilemembersastree", request: Models.MembersTreeRequest, options?: RequestOptions): Observable<Models.FileMemberTree>;
        request(path: "/diagnostics", request: Models.DiagnosticsRequest, options?: RequestOptions): Observable<Models.DiagnosticsResponse>;
        request(path: "/filesChanged", request: Models.Request[], options?: RequestOptions): Observable<Models.FilesChangedResponse>;
        request(path: "/findimplementations", request: Models.FindImplementationsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/findsymbols", request: Models.FindSymbolsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/findusages", request: Models.FindUsagesRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/fixusings", request: Models.FixUsingsRequest, options?: RequestOptions): Observable<Models.FixUsingsResponse>;
        request(path: "/formatAfterKeystroke", request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        request(path: "/formatRange", request: Models.FormatRangeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        request(path: "/getcodeactions", request: Models.GetCodeActionRequest, options?: RequestOptions): Observable<Models.GetCodeActionsResponse>;
        request(path: "/v2/getcodeactions", request: Models.V2.GetCodeActionsRequest, options?: RequestOptions): Observable<Models.V2.GetCodeActionsResponse>;
        request(path: "/gettestcontext", request: Models.TestCommandRequest, options?: RequestOptions): Observable<Models.GetTestCommandResponse>;
        request(path: "/v2/getteststartinfo", request: any, options?: RequestOptions): Observable<any>;
        request(path: "/gotodefinition", request: Models.GotoDefinitionRequest, options?: RequestOptions): Observable<Models.GotoDefinitionResponse>;
        request(path: "/gotofile", request: Models.GotoFileRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/gotoregion", request: Models.GotoRegionRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        request(path: "/highlight", request: Models.HighlightRequest, options?: RequestOptions): Observable<Models.HighlightResponse>;
        request(path: "/metadata", request: Models.MetadataRequest, options?: RequestOptions): Observable<Models.MetadataResponse>;
        request(path: "/navigatedown", request: Models.NavigateDownRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        request(path: "/navigateup", request: Models.NavigateUpRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        request(path: "/open", request: Models.FileOpenRequest, options?: RequestOptions): Observable<Models.FileOpenResponse>;
        request(path: "/packagesearch", request: Models.PackageSearchRequest, options?: RequestOptions): Observable<Models.PackageSearchResponse>;
        request(path: "/packagesource", request: Models.PackageSourceRequest, options?: RequestOptions): Observable<Models.PackageSourceResponse>;
        request(path: "/packageversion", request: Models.PackageVersionRequest, options?: RequestOptions): Observable<Models.PackageVersionResponse>;
        request(path: "/project", request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<Models.ProjectInformationResponse>;
        request(path: "/projects", request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<Models.WorkspaceInformationResponse>;
        request(path: "/rename", request: Models.RenameRequest, options?: RequestOptions): Observable<Models.RenameResponse>;
        request(path: "/runcodeaction", request: Models.RunCodeActionRequest, options?: RequestOptions): Observable<Models.RunCodeActionResponse>;
        request(path: "/v2/runcodeaction", request: Models.V2.RunCodeActionRequest, options?: RequestOptions): Observable<Models.V2.RunCodeActionResponse>;
        request(path: "/v2/runtest", request: any, options?: RequestOptions): Observable<any>;
        request(path: "/signatureHelp", request: Models.SignatureHelpRequest, options?: RequestOptions): Observable<Models.SignatureHelp>;
        request(path: "/stopserver", options?: RequestOptions): Observable<boolean>;
        request(path: "/typelookup", request: Models.TypeLookupRequest, options?: RequestOptions): Observable<Models.TypeLookupResponse>;
        request(path: "/updatebuffer", request: Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }
    interface V2 extends Common {
        autocomplete(request: Models.AutoCompleteRequest, options?: RequestOptions): Observable<Models.AutoCompleteResponse[]>;
        changebuffer(request: Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        checkalivestatus(options?: RequestOptions): Observable<boolean>;
        checkreadystatus(options?: RequestOptions): Observable<boolean>;
        close(request: Models.FileCloseRequest, options?: RequestOptions): Observable<Models.FileCloseResponse>;
        codecheck(request: Models.CodeCheckRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        codeformat(request: Models.CodeFormatRequest, options?: RequestOptions): Observable<Models.CodeFormatResponse>;
        currentfilemembersasflat(request: Models.MembersFlatRequest, options?: RequestOptions): Observable<Models.QuickFix[]>;
        currentfilemembersastree(request: Models.MembersTreeRequest, options?: RequestOptions): Observable<Models.FileMemberTree>;
        diagnostics(request: Models.DiagnosticsRequest, options?: RequestOptions): Observable<Models.DiagnosticsResponse>;
        filesChanged(request: Models.Request[], options?: RequestOptions): Observable<Models.FilesChangedResponse>;
        findimplementations(request: Models.FindImplementationsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findsymbols(request: Models.FindSymbolsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findusages(request: Models.FindUsagesRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        fixusings(request: Models.FixUsingsRequest, options?: RequestOptions): Observable<Models.FixUsingsResponse>;
        formatAfterKeystroke(request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        formatRange(request: Models.FormatRangeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        getcodeactions(request: Models.V2.GetCodeActionsRequest, options?: RequestOptions): Observable<Models.V2.GetCodeActionsResponse>;
        gettestcontext(request: Models.TestCommandRequest, options?: RequestOptions): Observable<Models.GetTestCommandResponse>;
        getteststartinfo(request: any, options?: RequestOptions): Observable<any>;
        gotodefinition(request: Models.GotoDefinitionRequest, options?: RequestOptions): Observable<Models.GotoDefinitionResponse>;
        gotofile(request: Models.GotoFileRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        gotoregion(request: Models.GotoRegionRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        highlight(request: Models.HighlightRequest, options?: RequestOptions): Observable<Models.HighlightResponse>;
        metadata(request: Models.MetadataRequest, options?: RequestOptions): Observable<Models.MetadataResponse>;
        navigatedown(request: Models.NavigateDownRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        navigateup(request: Models.NavigateUpRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        open(request: Models.FileOpenRequest, options?: RequestOptions): Observable<Models.FileOpenResponse>;
        packagesearch(request: Models.PackageSearchRequest, options?: RequestOptions): Observable<Models.PackageSearchResponse>;
        packagesource(request: Models.PackageSourceRequest, options?: RequestOptions): Observable<Models.PackageSourceResponse>;
        packageversion(request: Models.PackageVersionRequest, options?: RequestOptions): Observable<Models.PackageVersionResponse>;
        project(request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<Models.ProjectInformationResponse>;
        projects(request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<Models.WorkspaceInformationResponse>;
        rename(request: Models.RenameRequest, options?: RequestOptions): Observable<Models.RenameResponse>;
        runcodeaction(request: Models.V2.RunCodeActionRequest, options?: RequestOptions): Observable<Models.V2.RunCodeActionResponse>;
        runtest(request: any, options?: RequestOptions): Observable<any>;
        signatureHelp(request: Models.SignatureHelpRequest, options?: RequestOptions): Observable<Models.SignatureHelp>;
        stopserver(options?: RequestOptions): Observable<boolean>;
        typelookup(request: Models.TypeLookupRequest, options?: RequestOptions): Observable<Models.TypeLookupResponse>;
        updatebuffer(request: Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }
    interface V1 extends Common {
        autocomplete(request: Models.AutoCompleteRequest, options?: RequestOptions): Observable<Models.AutoCompleteResponse[]>;
        changebuffer(request: Models.ChangeBufferRequest, options?: RequestOptions): Observable<any>;
        checkalivestatus(options?: RequestOptions): Observable<boolean>;
        checkreadystatus(options?: RequestOptions): Observable<boolean>;
        close(request: Models.FileCloseRequest, options?: RequestOptions): Observable<Models.FileCloseResponse>;
        codecheck(request: Models.CodeCheckRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        codeformat(request: Models.CodeFormatRequest, options?: RequestOptions): Observable<Models.CodeFormatResponse>;
        currentfilemembersasflat(request: Models.MembersFlatRequest, options?: RequestOptions): Observable<Models.QuickFix[]>;
        currentfilemembersastree(request: Models.MembersTreeRequest, options?: RequestOptions): Observable<Models.FileMemberTree>;
        diagnostics(request: Models.DiagnosticsRequest, options?: RequestOptions): Observable<Models.DiagnosticsResponse>;
        filesChanged(request: Models.Request[], options?: RequestOptions): Observable<Models.FilesChangedResponse>;
        findimplementations(request: Models.FindImplementationsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findsymbols(request: Models.FindSymbolsRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        findusages(request: Models.FindUsagesRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        fixusings(request: Models.FixUsingsRequest, options?: RequestOptions): Observable<Models.FixUsingsResponse>;
        formatAfterKeystroke(request: Models.FormatAfterKeystrokeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        formatRange(request: Models.FormatRangeRequest, options?: RequestOptions): Observable<Models.FormatRangeResponse>;
        getcodeactions(request: Models.GetCodeActionRequest, options?: RequestOptions): Observable<Models.GetCodeActionsResponse>;
        gettestcontext(request: Models.TestCommandRequest, options?: RequestOptions): Observable<Models.GetTestCommandResponse>;
        getteststartinfo(request: any, options?: RequestOptions): Observable<any>;
        gotodefinition(request: Models.GotoDefinitionRequest, options?: RequestOptions): Observable<Models.GotoDefinitionResponse>;
        gotofile(request: Models.GotoFileRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        gotoregion(request: Models.GotoRegionRequest, options?: RequestOptions): Observable<Models.QuickFixResponse>;
        highlight(request: Models.HighlightRequest, options?: RequestOptions): Observable<Models.HighlightResponse>;
        metadata(request: Models.MetadataRequest, options?: RequestOptions): Observable<Models.MetadataResponse>;
        navigatedown(request: Models.NavigateDownRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        navigateup(request: Models.NavigateUpRequest, options?: RequestOptions): Observable<Models.NavigateResponse>;
        open(request: Models.FileOpenRequest, options?: RequestOptions): Observable<Models.FileOpenResponse>;
        packagesearch(request: Models.PackageSearchRequest, options?: RequestOptions): Observable<Models.PackageSearchResponse>;
        packagesource(request: Models.PackageSourceRequest, options?: RequestOptions): Observable<Models.PackageSourceResponse>;
        packageversion(request: Models.PackageVersionRequest, options?: RequestOptions): Observable<Models.PackageVersionResponse>;
        project(request: Models.v1.ProjectInformationRequest, options?: RequestOptions): Observable<Models.ProjectInformationResponse>;
        projects(request: Models.v1.WorkspaceInformationRequest, options?: RequestOptions): Observable<Models.WorkspaceInformationResponse>;
        rename(request: Models.RenameRequest, options?: RequestOptions): Observable<Models.RenameResponse>;
        runcodeaction(request: Models.RunCodeActionRequest, options?: RequestOptions): Observable<Models.RunCodeActionResponse>;
        runtest(request: any, options?: RequestOptions): Observable<any>;
        signatureHelp(request: Models.SignatureHelpRequest, options?: RequestOptions): Observable<Models.SignatureHelp>;
        stopserver(options?: RequestOptions): Observable<boolean>;
        typelookup(request: Models.TypeLookupRequest, options?: RequestOptions): Observable<Models.TypeLookupResponse>;
        updatebuffer(request: Models.UpdateBufferRequest, options?: RequestOptions): Observable<any>;
    }
    function getVersion(name: string): "v2" | "v1";
}
export declare module Events {
    interface Common {
        listen(path: string): Observable<any>;
        listen(path: "/autocomplete"): Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        listen(path: "/changebuffer"): Observable<Context<Models.ChangeBufferRequest, any>>;
        listen(path: "/checkalivestatus"): Observable<Context<any, boolean>>;
        listen(path: "/checkreadystatus"): Observable<Context<any, boolean>>;
        listen(path: "/close"): Observable<Context<Models.FileCloseRequest, Models.FileCloseResponse>>;
        listen(path: "/codecheck"): Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        listen(path: "/codeformat"): Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        listen(path: "/currentfilemembersasflat"): Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        listen(path: "/currentfilemembersastree"): Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        listen(path: "/diagnostics"): Observable<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>;
        listen(path: "/filesChanged"): Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        listen(path: "/findimplementations"): Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        listen(path: "/findsymbols"): Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        listen(path: "/findusages"): Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        listen(path: "/fixusings"): Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        listen(path: "/formatAfterKeystroke"): Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        listen(path: "/formatRange"): Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        listen(path: "/getcodeactions"): Observable<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>;
        listen(path: "/v2/getcodeactions"): Observable<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>;
        listen(path: "/gettestcontext"): Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        listen(path: "/v2/getteststartinfo"): Observable<Context<any, any>>;
        listen(path: "/gotodefinition"): Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        listen(path: "/gotofile"): Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        listen(path: "/gotoregion"): Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        listen(path: "/highlight"): Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        listen(path: "/metadata"): Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        listen(path: "/navigatedown"): Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        listen(path: "/navigateup"): Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        listen(path: "/open"): Observable<Context<Models.FileOpenRequest, Models.FileOpenResponse>>;
        listen(path: "/packagesearch"): Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        listen(path: "/packagesource"): Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        listen(path: "/packageversion"): Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        listen(path: "/project"): Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        listen(path: "/projects"): Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        listen(path: "/rename"): Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        listen(path: "/runcodeaction"): Observable<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>;
        listen(path: "/v2/runcodeaction"): Observable<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>;
        listen(path: "/v2/runtest"): Observable<Context<any, any>>;
        listen(path: "/signatureHelp"): Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        listen(path: "/stopserver"): Observable<Context<any, boolean>>;
        listen(path: "/typelookup"): Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        listen(path: "/updatebuffer"): Observable<Context<Models.UpdateBufferRequest, any>>;
    }
    interface V2 extends Common {
        autocomplete: Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        changebuffer: Observable<Context<Models.ChangeBufferRequest, any>>;
        checkalivestatus: Observable<Context<any, boolean>>;
        checkreadystatus: Observable<Context<any, boolean>>;
        close: Observable<Context<Models.FileCloseRequest, Models.FileCloseResponse>>;
        codecheck: Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        codeformat: Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        currentfilemembersasflat: Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        currentfilemembersastree: Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        diagnostics: Observable<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>;
        filesChanged: Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        findimplementations: Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        findsymbols: Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        findusages: Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        fixusings: Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        formatAfterKeystroke: Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        formatRange: Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        getcodeactions: Observable<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>;
        gettestcontext: Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        getteststartinfo: Observable<Context<any, any>>;
        gotodefinition: Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        gotofile: Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        gotoregion: Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        highlight: Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        metadata: Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        navigatedown: Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        navigateup: Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        open: Observable<Context<Models.FileOpenRequest, Models.FileOpenResponse>>;
        packagesearch: Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        packagesource: Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        packageversion: Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        project: Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        projects: Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        rename: Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        runcodeaction: Observable<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>;
        runtest: Observable<Context<any, any>>;
        signatureHelp: Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        stopserver: Observable<Context<any, boolean>>;
        typelookup: Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        updatebuffer: Observable<Context<Models.UpdateBufferRequest, any>>;
    }
    interface V1 extends Common {
        autocomplete: Observable<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>;
        changebuffer: Observable<Context<Models.ChangeBufferRequest, any>>;
        checkalivestatus: Observable<Context<any, boolean>>;
        checkreadystatus: Observable<Context<any, boolean>>;
        close: Observable<Context<Models.FileCloseRequest, Models.FileCloseResponse>>;
        codecheck: Observable<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>;
        codeformat: Observable<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>;
        currentfilemembersasflat: Observable<Context<Models.MembersFlatRequest, Models.QuickFix[]>>;
        currentfilemembersastree: Observable<Context<Models.MembersTreeRequest, Models.FileMemberTree>>;
        diagnostics: Observable<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>;
        filesChanged: Observable<Context<Models.Request[], Models.FilesChangedResponse>>;
        findimplementations: Observable<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>;
        findsymbols: Observable<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>;
        findusages: Observable<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>;
        fixusings: Observable<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>;
        formatAfterKeystroke: Observable<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>;
        formatRange: Observable<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>;
        getcodeactions: Observable<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>;
        gettestcontext: Observable<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>;
        getteststartinfo: Observable<Context<any, any>>;
        gotodefinition: Observable<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>;
        gotofile: Observable<Context<Models.GotoFileRequest, Models.QuickFixResponse>>;
        gotoregion: Observable<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>;
        highlight: Observable<Context<Models.HighlightRequest, Models.HighlightResponse>>;
        metadata: Observable<Context<Models.MetadataRequest, Models.MetadataResponse>>;
        navigatedown: Observable<Context<Models.NavigateDownRequest, Models.NavigateResponse>>;
        navigateup: Observable<Context<Models.NavigateUpRequest, Models.NavigateResponse>>;
        open: Observable<Context<Models.FileOpenRequest, Models.FileOpenResponse>>;
        packagesearch: Observable<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>;
        packagesource: Observable<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>;
        packageversion: Observable<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>;
        project: Observable<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>;
        projects: Observable<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>;
        rename: Observable<Context<Models.RenameRequest, Models.RenameResponse>>;
        runcodeaction: Observable<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>;
        runtest: Observable<Context<any, any>>;
        signatureHelp: Observable<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>;
        stopserver: Observable<Context<any, boolean>>;
        typelookup: Observable<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>;
        updatebuffer: Observable<Context<Models.UpdateBufferRequest, any>>;
    }
}
export declare module Events.Aggregate {
    interface Common {
        listen(path: string): Observable<any>;
        listen(path: "/autocomplete"): Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        listen(path: "/changebuffer"): Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        listen(path: "/checkalivestatus"): Observable<CombinationKey<Context<any, boolean>>>;
        listen(path: "/checkreadystatus"): Observable<CombinationKey<Context<any, boolean>>>;
        listen(path: "/close"): Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]>;
        listen(path: "/codecheck"): Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/codeformat"): Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        listen(path: "/currentfilemembersasflat"): Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        listen(path: "/currentfilemembersastree"): Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        listen(path: "/diagnostics"): Observable<CombinationKey<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>[]>;
        listen(path: "/filesChanged"): Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        listen(path: "/findimplementations"): Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/findsymbols"): Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/findusages"): Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/fixusings"): Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        listen(path: "/formatAfterKeystroke"): Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        listen(path: "/formatRange"): Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        listen(path: "/getcodeactions"): Observable<CombinationKey<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>[]>;
        listen(path: "/v2/getcodeactions"): Observable<CombinationKey<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>[]>;
        listen(path: "/gettestcontext"): Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        listen(path: "/v2/getteststartinfo"): Observable<CombinationKey<Context<any, any>>[]>;
        listen(path: "/gotodefinition"): Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        listen(path: "/gotofile"): Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/gotoregion"): Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        listen(path: "/highlight"): Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        listen(path: "/metadata"): Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        listen(path: "/navigatedown"): Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        listen(path: "/navigateup"): Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        listen(path: "/open"): Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]>;
        listen(path: "/packagesearch"): Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        listen(path: "/packagesource"): Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        listen(path: "/packageversion"): Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        listen(path: "/project"): Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        listen(path: "/projects"): Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        listen(path: "/rename"): Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        listen(path: "/runcodeaction"): Observable<CombinationKey<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>[]>;
        listen(path: "/v2/runcodeaction"): Observable<CombinationKey<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>[]>;
        listen(path: "/v2/runtest"): Observable<CombinationKey<Context<any, any>>[]>;
        listen(path: "/signatureHelp"): Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        listen(path: "/stopserver"): Observable<CombinationKey<Context<any, boolean>>>;
        listen(path: "/typelookup"): Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        listen(path: "/updatebuffer"): Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }
    interface V2 {
        autocomplete: Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        changebuffer: Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        checkalivestatus: Observable<CombinationKey<Context<any, boolean>>>;
        checkreadystatus: Observable<CombinationKey<Context<any, boolean>>>;
        close: Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]>;
        codecheck: Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        codeformat: Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        currentfilemembersasflat: Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        currentfilemembersastree: Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        diagnostics: Observable<CombinationKey<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>[]>;
        filesChanged: Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        findimplementations: Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        findsymbols: Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        findusages: Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        fixusings: Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        formatAfterKeystroke: Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        formatRange: Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        getcodeactions: Observable<CombinationKey<Context<Models.V2.GetCodeActionsRequest, Models.V2.GetCodeActionsResponse>>[]>;
        gettestcontext: Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        getteststartinfo: Observable<CombinationKey<Context<any, any>>[]>;
        gotodefinition: Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        gotofile: Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        gotoregion: Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        highlight: Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        metadata: Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        navigatedown: Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        navigateup: Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        open: Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]>;
        packagesearch: Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        packagesource: Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        packageversion: Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        project: Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        projects: Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        rename: Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        runcodeaction: Observable<CombinationKey<Context<Models.V2.RunCodeActionRequest, Models.V2.RunCodeActionResponse>>[]>;
        runtest: Observable<CombinationKey<Context<any, any>>[]>;
        signatureHelp: Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        stopserver: Observable<CombinationKey<Context<any, boolean>>>;
        typelookup: Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        updatebuffer: Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }
    interface V1 {
        autocomplete: Observable<CombinationKey<Context<Models.AutoCompleteRequest, Models.AutoCompleteResponse[]>>[]>;
        changebuffer: Observable<CombinationKey<Context<Models.ChangeBufferRequest, any>>[]>;
        checkalivestatus: Observable<CombinationKey<Context<any, boolean>>>;
        checkreadystatus: Observable<CombinationKey<Context<any, boolean>>>;
        close: Observable<CombinationKey<Context<Models.FileCloseRequest, Models.FileCloseResponse>>[]>;
        codecheck: Observable<CombinationKey<Context<Models.CodeCheckRequest, Models.QuickFixResponse>>[]>;
        codeformat: Observable<CombinationKey<Context<Models.CodeFormatRequest, Models.CodeFormatResponse>>[]>;
        currentfilemembersasflat: Observable<CombinationKey<Context<Models.MembersFlatRequest, Models.QuickFix[]>>[]>;
        currentfilemembersastree: Observable<CombinationKey<Context<Models.MembersTreeRequest, Models.FileMemberTree>>[]>;
        diagnostics: Observable<CombinationKey<Context<Models.DiagnosticsRequest, Models.DiagnosticsResponse>>[]>;
        filesChanged: Observable<CombinationKey<Context<Models.Request[], Models.FilesChangedResponse>>[]>;
        findimplementations: Observable<CombinationKey<Context<Models.FindImplementationsRequest, Models.QuickFixResponse>>[]>;
        findsymbols: Observable<CombinationKey<Context<Models.FindSymbolsRequest, Models.QuickFixResponse>>[]>;
        findusages: Observable<CombinationKey<Context<Models.FindUsagesRequest, Models.QuickFixResponse>>[]>;
        fixusings: Observable<CombinationKey<Context<Models.FixUsingsRequest, Models.FixUsingsResponse>>[]>;
        formatAfterKeystroke: Observable<CombinationKey<Context<Models.FormatAfterKeystrokeRequest, Models.FormatRangeResponse>>[]>;
        formatRange: Observable<CombinationKey<Context<Models.FormatRangeRequest, Models.FormatRangeResponse>>[]>;
        getcodeactions: Observable<CombinationKey<Context<Models.GetCodeActionRequest, Models.GetCodeActionsResponse>>[]>;
        gettestcontext: Observable<CombinationKey<Context<Models.TestCommandRequest, Models.GetTestCommandResponse>>[]>;
        getteststartinfo: Observable<CombinationKey<Context<any, any>>[]>;
        gotodefinition: Observable<CombinationKey<Context<Models.GotoDefinitionRequest, Models.GotoDefinitionResponse>>[]>;
        gotofile: Observable<CombinationKey<Context<Models.GotoFileRequest, Models.QuickFixResponse>>[]>;
        gotoregion: Observable<CombinationKey<Context<Models.GotoRegionRequest, Models.QuickFixResponse>>[]>;
        highlight: Observable<CombinationKey<Context<Models.HighlightRequest, Models.HighlightResponse>>[]>;
        metadata: Observable<CombinationKey<Context<Models.MetadataRequest, Models.MetadataResponse>>[]>;
        navigatedown: Observable<CombinationKey<Context<Models.NavigateDownRequest, Models.NavigateResponse>>[]>;
        navigateup: Observable<CombinationKey<Context<Models.NavigateUpRequest, Models.NavigateResponse>>[]>;
        open: Observable<CombinationKey<Context<Models.FileOpenRequest, Models.FileOpenResponse>>[]>;
        packagesearch: Observable<CombinationKey<Context<Models.PackageSearchRequest, Models.PackageSearchResponse>>[]>;
        packagesource: Observable<CombinationKey<Context<Models.PackageSourceRequest, Models.PackageSourceResponse>>[]>;
        packageversion: Observable<CombinationKey<Context<Models.PackageVersionRequest, Models.PackageVersionResponse>>[]>;
        project: Observable<CombinationKey<Context<Models.v1.ProjectInformationRequest, Models.ProjectInformationResponse>>[]>;
        projects: Observable<CombinationKey<Context<Models.v1.WorkspaceInformationRequest, Models.WorkspaceInformationResponse>>[]>;
        rename: Observable<CombinationKey<Context<Models.RenameRequest, Models.RenameResponse>>[]>;
        runcodeaction: Observable<CombinationKey<Context<Models.RunCodeActionRequest, Models.RunCodeActionResponse>>[]>;
        runtest: Observable<CombinationKey<Context<any, any>>[]>;
        signatureHelp: Observable<CombinationKey<Context<Models.SignatureHelpRequest, Models.SignatureHelp>>[]>;
        stopserver: Observable<CombinationKey<Context<any, boolean>>>;
        typelookup: Observable<CombinationKey<Context<Models.TypeLookupRequest, Models.TypeLookupResponse>>[]>;
        updatebuffer: Observable<CombinationKey<Context<Models.UpdateBufferRequest, any>>[]>;
    }
}
export interface Events {
    listen(path: string): Observable<any>;
    listen(path: "projectAdded"): Observable<Models.ProjectInformationResponse>;
    listen(path: "projectChanged"): Observable<Models.ProjectInformationResponse>;
    listen(path: "projectRemoved"): Observable<Models.ProjectInformationResponse>;
    listen(path: "error"): Observable<Models.ErrorMessage>;
    listen(path: "diagnostic"): Observable<Models.DiagnosticMessage>;
    listen(path: "msBuildProjectDiagnostics"): Observable<Models.MSBuildProjectDiagnostics>;
    listen(path: "packageRestoreStarted"): Observable<Models.PackageRestoreMessage>;
    listen(path: "packageRestoreFinished"): Observable<Models.PackageRestoreMessage>;
    listen(path: "unresolvedDependencies"): Observable<Models.UnresolvedDependenciesMessage>;
    projectAdded: Observable<Models.ProjectInformationResponse>;
    projectChanged: Observable<Models.ProjectInformationResponse>;
    projectRemoved: Observable<Models.ProjectInformationResponse>;
    error: Observable<Models.ErrorMessage>;
    diagnostic: Observable<Models.DiagnosticMessage>;
    msBuildProjectDiagnostics: Observable<Models.MSBuildProjectDiagnostics>;
    packageRestoreStarted: Observable<Models.PackageRestoreMessage>;
    packageRestoreFinished: Observable<Models.PackageRestoreMessage>;
    unresolvedDependencies: Observable<Models.UnresolvedDependenciesMessage>;
}
export declare module Aggregate {
    interface Events {
        listen(path: string): Observable<any>;
        listen(path: "projectAdded"): Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        listen(path: "projectChanged"): Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        listen(path: "projectRemoved"): Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        listen(path: "error"): Observable<CombinationKey<Models.ErrorMessage>[]>;
        listen(path: "diagnostic"): Observable<CombinationKey<Models.DiagnosticMessage>[]>;
        listen(path: "msBuildProjectDiagnostics"): Observable<CombinationKey<Models.MSBuildProjectDiagnostics>[]>;
        listen(path: "packageRestoreStarted"): Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        listen(path: "packageRestoreFinished"): Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        listen(path: "unresolvedDependencies"): Observable<CombinationKey<Models.UnresolvedDependenciesMessage>[]>;
        projectAdded: Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        projectChanged: Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        projectRemoved: Observable<CombinationKey<Models.ProjectInformationResponse>[]>;
        error: Observable<CombinationKey<Models.ErrorMessage>[]>;
        diagnostic: Observable<CombinationKey<Models.DiagnosticMessage>[]>;
        msBuildProjectDiagnostics: Observable<CombinationKey<Models.MSBuildProjectDiagnostics>[]>;
        packageRestoreStarted: Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        packageRestoreFinished: Observable<CombinationKey<Models.PackageRestoreMessage>[]>;
        unresolvedDependencies: Observable<CombinationKey<Models.UnresolvedDependenciesMessage>[]>;
    }
}
export declare module Models {
    interface ProjectInformationResponse {
        MsBuildProject: Models.MSBuildProject;
        DotNetProject: Models.DotNetProjectInformation;
    }
    interface WorkspaceInformationResponse {
        DotNet: Models.DotNetWorkspaceInformation;
        MSBuild: Models.MsBuildWorkspaceInformation;
        ScriptCs: ScriptCs.ScriptCsContextModel;
    }
}
