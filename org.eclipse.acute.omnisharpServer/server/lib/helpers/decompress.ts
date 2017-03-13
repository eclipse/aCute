export interface IDecompressOptions {
    mode?: string;
    strip?: number;
}
import { assign } from 'lodash';
/* tslint:disable:variable-name no-var-requires no-require-imports */
const d = require('decompress');
/* tslint:enable:variable-name */
export function decompress(input: string, output?: string, options?: IDecompressOptions): Promise<string[]> {
    return d(input, output, assign(options, {
        plugins: [require('decompress-targz')(), require('decompress-unzip')()]
    }));
}
