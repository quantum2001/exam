import { Response } from 'express';
export declare const sendResponse: (res: Response, data: any, message: any, statusCode: number, status: 'error' | 'success') => void;
