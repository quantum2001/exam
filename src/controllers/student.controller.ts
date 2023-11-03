import { Request, Response } from "express";
interface AuthenticatedReq extends Request {
    user?: any
}
export const login = (req: Request, res: Response) => {

}
export const startExam = (req: AuthenticatedReq, res: Response) => {

}
export const endExam = (req: AuthenticatedReq, res: Response) => {

}
export const submitAnswer = (req: AuthenticatedReq, res: Response) => {

}
