export declare type PreconditionMethod = ((request: any) => void);
export declare function getPreconditions(key: string): ((request: any) => void)[];
