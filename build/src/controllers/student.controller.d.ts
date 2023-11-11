import { Request, Response } from 'express';
interface AuthenticatedReq extends Request {
    user?: any;
}
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const submitAnswer: (req: AuthenticatedReq, res: Response) => Promise<void>;
export declare const getAllSchools: (req: Request, res: Response) => Promise<void>;
export {};
