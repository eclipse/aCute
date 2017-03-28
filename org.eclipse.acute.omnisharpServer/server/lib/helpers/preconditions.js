"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
var lodash_1 = require("lodash");
function isNotNull(property) {
    return function (request) {
        var result = lodash_1.get(request, property);
        if (lodash_1.isNull(result) || lodash_1.isUndefined(result)) {
            var errorText = property + " must not be null.";
            throw new Error(errorText);
        }
    };
}
function isAboveZero(property) {
    return function (request) {
        var minValue = 0;
        var result = lodash_1.get(request, property);
        if (lodash_1.isNull(result) || lodash_1.isUndefined(result)) {
            return;
        }
        if (result < minValue) {
            var errorText = property + " must be greater than or equal to " + minValue + ".";
            throw new Error(errorText);
        }
    };
}
function precondition(property) {
    var decorators = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        decorators[_i - 1] = arguments[_i];
    }
    return function (request) {
        if (property(request)) {
            lodash_1.each(decorators, function (decorator) {
                decorator(request);
            });
        }
    };
}
function any() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        properties[_i] = arguments[_i];
    }
    return function (request) {
        var anyMatch = lodash_1.some(properties, function (property) {
            var result = lodash_1.get(request, property);
            if (result === null || result === undefined) {
                return false;
            }
            return true;
        });
        if (!anyMatch) {
            var errorText = properties.join(' || ') + "  must not be null.";
            throw new Error(errorText);
        }
    };
}
var preconditions = {};
function getPreconditions(key) {
    return preconditions[key.toLocaleLowerCase()] || [];
}
exports.getPreconditions = getPreconditions;
preconditions['/v2/getcodeactions'] = [
    isNotNull("FileName"),
    precondition(function (x) { return !x.Selection; }, isNotNull("Line"), isAboveZero("Line"), isNotNull("Column"), isAboveZero("Column")),
    precondition(function (x) { return !!x.Selection; }, isNotNull("Selection.Start.Line"), isAboveZero("Selection.Start.Line"), isNotNull("Selection.Start.Column"), isAboveZero("Selection.Start.Column"), isNotNull("Selection.End.Line"), isAboveZero("Selection.End.Line"), isNotNull("Selection.End.Column"), isAboveZero("Selection.End.Column"))
];
preconditions['/v2/runcodeaction'] = [
    isNotNull("FileName"),
    isNotNull("Identifier"),
    precondition(function (x) { return !x.Selection; }, isNotNull("Line"), isAboveZero("Line"), isNotNull("Column"), isAboveZero("Column")),
    precondition(function (x) { return !!x.Selection; }, isNotNull("Selection.Start.Line"), isAboveZero("Selection.Start.Line"), isNotNull("Selection.Start.Column"), isAboveZero("Selection.Start.Column"), isNotNull("Selection.End.Line"), isAboveZero("Selection.End.Line"), isNotNull("Selection.End.Column"), isAboveZero("Selection.End.Column"))
];
// OmniSharp.Models.UpdateBufferRequest
preconditions['/updatebuffer'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.ChangeBufferRequest
preconditions['/changebuffer'] = [
    isNotNull("FileName"),
    isNotNull("NewText"),
    isNotNull("StartLine"),
    isAboveZero("StartLine"),
    isNotNull("StartColumn"),
    isAboveZero("StartColumn"),
    isNotNull("EndLine"),
    isAboveZero("EndLine"),
    isNotNull("EndColumn"),
    isAboveZero("EndColumn")
];
// OmniSharp.Models.FormatAfterKeystrokeRequest
preconditions['/formatafterkeystroke'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column"),
    any("Character", "Char")
];
// OmniSharp.Models.FormatRangeRequest
preconditions['/formatrange'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column"),
    isNotNull("EndLine"),
    isAboveZero("EndLine"),
    isNotNull("EndColumn"),
    isAboveZero("EndColumn")
];
// OmniSharp.Models.CodeFormatRequest
preconditions['/codeformat'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.AutoCompleteRequest
preconditions['/autocomplete'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column"),
    isNotNull("WordToComplete")
];
// OmniSharp.Models.FindImplementationsRequest
preconditions['/findimplementations'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.FindSymbolsRequest
preconditions['/findsymbols'] = [
    isNotNull("Filter")
];
// OmniSharp.Models.FindUsagesRequest
preconditions['/findusages'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.FixUsingsRequest
preconditions['/fixusings'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.GotoDefinitionRequest
preconditions['/gotodefinition'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.NavigateUpRequest
preconditions['/navigateup'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.GotoFileRequest
preconditions['/gotofile'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.GotoRegionRequest
preconditions['/gotoregion'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.HighlightRequest
preconditions['/highlight'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.MetadataRequest
preconditions['/metadata'] = [
    isNotNull("AssemblyName"),
    isNotNull("TypeName")
];
// OmniSharp.Models.NavigateDownRequest
preconditions['/navigatedown'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.PackageSearchRequest
preconditions['/packagesearch'] = [
    isNotNull("ProjectPath"),
    isNotNull("Search")
];
// OmniSharp.Models.PackageSourceRequest
preconditions['/packagesource'] = [
    isNotNull("ProjectPath")
];
// OmniSharp.Models.PackageVersionRequest
preconditions['/packageversion'] = [
    isNotNull("ProjectPath"),
    isNotNull("Id")
];
// OmniSharp.Models.RenameRequest
preconditions['/rename'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column"),
    isNotNull("RenameTo")
];
// OmniSharp.Models.SignatureHelpRequest
preconditions['/signaturehelp'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.MembersTreeRequest
preconditions['/currentfilemembersastree'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.MembersTreeRequest
preconditions['/fileschanged'] = [
    function (request) {
        if (!request) {
            var errorText = "fileschanged must not be null.";
            throw new Error(errorText);
        }
        if (lodash_1.some(request, function (x) { return !x.FileName; })) {
            var errorText = "fileschanged[].FileName must not be null.";
            throw new Error(errorText);
        }
    }
];
// OmniSharp.Models.MembersFlatRequest
preconditions['/currentfilemembersasflat'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.TypeLookupRequest
preconditions['/typelookup'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column")
];
// OmniSharp.Models.v1.ProjectInformationRequest
preconditions['/project'] = [
    isNotNull("FileName")
];
// OmniSharp.Models.TestCommandRequest
preconditions['/gettestcontext'] = [
    isNotNull("FileName"),
    isNotNull("Line"),
    isAboveZero("Line"),
    isNotNull("Column"),
    isAboveZero("Column"),
    isNotNull("Type"),
    isAboveZero("Type")
];
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/preconditions.js.map