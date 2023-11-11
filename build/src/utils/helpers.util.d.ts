export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateAlphanumericPassword: (length: number) => string;
export declare const cleanUp: (doc: any) => any;
