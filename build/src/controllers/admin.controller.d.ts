import { Request, Response } from 'express';
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getAllSchools: (req: Request, res: Response) => Promise<void>;
export declare const getSingleSchool: (req: Request, res: Response) => Promise<void>;
export declare const disableSchool: (req: Request, res: Response) => Promise<void>;
export declare const enableSchool: (req: Request, res: Response) => Promise<void>;
export declare const deleteSchool: (req: Request, res: Response) => Promise<void>;
export declare const updateSchoolExamCount: (req: Request, res: Response) => Promise<void>;
