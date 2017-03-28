"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Models;
(function (Models) {
    var HighlightClassification;
    (function (HighlightClassification) {
        HighlightClassification[HighlightClassification["Name"] = 1] = "Name";
        HighlightClassification[HighlightClassification["Comment"] = 2] = "Comment";
        HighlightClassification[HighlightClassification["String"] = 3] = "String";
        HighlightClassification[HighlightClassification["Operator"] = 4] = "Operator";
        HighlightClassification[HighlightClassification["Punctuation"] = 5] = "Punctuation";
        HighlightClassification[HighlightClassification["Keyword"] = 6] = "Keyword";
        HighlightClassification[HighlightClassification["Number"] = 7] = "Number";
        HighlightClassification[HighlightClassification["Identifier"] = 8] = "Identifier";
        HighlightClassification[HighlightClassification["PreprocessorKeyword"] = 9] = "PreprocessorKeyword";
        HighlightClassification[HighlightClassification["ExcludedCode"] = 10] = "ExcludedCode";
    })(HighlightClassification = Models.HighlightClassification || (Models.HighlightClassification = {}));
})(Models = exports.Models || (exports.Models = {}));
var TestCommandType;
(function (TestCommandType) {
    TestCommandType[TestCommandType["All"] = 0] = "All";
    TestCommandType[TestCommandType["Fixture"] = 1] = "Fixture";
    TestCommandType[TestCommandType["Single"] = 2] = "Single";
})(TestCommandType = exports.TestCommandType || (exports.TestCommandType = {}));
var Api;
(function (Api) {
    function getVersion(name) {
        if ("getteststartinfo" === name.toLowerCase()) {
            return "v2";
        }
        if ("runtest" === name.toLowerCase()) {
            return "v2";
        }
        if ("getcodeactions" === name.toLowerCase()) {
            return "v2";
        }
        if ("runcodeaction" === name.toLowerCase()) {
            return "v2";
        }
        return "v1";
    }
    Api.getVersion = getVersion;
})(Api = exports.Api || (exports.Api = {}));
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/omnisharp-server.js.map