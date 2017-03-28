"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/* tslint:disable:variable-name no-var-requires no-require-imports */
var d = require('decompress');
/* tslint:enable:variable-name */
function decompress(input, output, options) {
    return d(input, output, lodash_1.assign(options, {
        plugins: [require('decompress-targz')(), require('decompress-unzip')()]
    }));
}
exports.decompress = decompress;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/helpers/decompress.js.map