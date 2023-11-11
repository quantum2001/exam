import { NextFunction, Request, Response } from 'express';
interface AuthenticatedReq extends Request {
    user?: any;
}
export declare const verifyStudent: (req: AuthenticatedReq, res: Response, next: NextFunction) => void;
export declare const verifyAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const verifySchool: (req: AuthenticatedReq, res: Response, next: NextFunction) => void;
export {};
