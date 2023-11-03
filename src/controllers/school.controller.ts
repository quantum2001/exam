import { Request, Response } from "express";
interface AuthenticatedReq extends Request {
    user?: any
}


export const register = (req: Request, res: Response) => {

}
export const login = (req: Request, res: Response) => {

}
export const getSchool = (req: AuthenticatedReq, res: Response) => {

}
export const updateSchool = (req: AuthenticatedReq, res: Response) => {

}
export const createStudent = (req: AuthenticatedReq, res: Response) => {

}
export const getStudent = (req: AuthenticatedReq, res: Response) => {

}
export const getAllStudents = (req: AuthenticatedReq, res: Response) => {

}
export const deleteStudent = (req: AuthenticatedReq, res: Response) => {

}
export const updateStudent = (req: AuthenticatedReq, res: Response) => {

}
export const createExam = (req: AuthenticatedReq, res: Response) => {

}
export const getAllExam = (req: AuthenticatedReq, res: Response) => {

}
export const getExam = (req: AuthenticatedReq, res: Response) => {

}
export const deleteExam = (req: AuthenticatedReq, res: Response) => {

}
export const downloadResult = (req: AuthenticatedReq, res: Response) => {

}
export const updateExam = (req: AuthenticatedReq, res: Response) => {

}
export const startExam = (req: AuthenticatedReq, res: Response) => {

}
export const endExam = (req: AuthenticatedReq, res: Response) => {

}
export const createExamQuestion = (req: AuthenticatedReq, res: Response) => {

}
export const getAllExamQuestions = (req: AuthenticatedReq, res: Response) => {

}
export const getSingleExamQuestion = (req: AuthenticatedReq, res: Response) => {

}
export const updateExamQuestion = (req: AuthenticatedReq, res: Response) => {

}
export const deleteExamQuestion = (req: AuthenticatedReq, res: Response) => {

}
