export declare const signJWT: (data: any, type: 'admin' | 'student' | 'school') => string;
export declare const verifyJWT: (token: string) => {
    data: any;
    type: 'admin' | 'student' | 'school';
    iat: number;
    iss: string;
} | null;
