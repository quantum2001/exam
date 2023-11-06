import {Request, Response} from 'express';
interface AuthenticatedReq extends Request {
  user?: any;
}
export const login = async (req: Request, res: Response) => {};
export const startExam = async (req: AuthenticatedReq, res: Response) => {};
export const endExam = async (req: AuthenticatedReq, res: Response) => {};
export const submitAnswer = async (req: AuthenticatedReq, res: Response) => {};
