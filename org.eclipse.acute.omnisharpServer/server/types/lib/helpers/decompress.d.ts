export interface IDecompressOptions {
    mode?: string;
    strip?: number;
}
export declare function decompress(input: string, output?: string, options?: IDecompressOptions): Promise<string[]>;
