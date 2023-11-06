import {Response} from 'express';

export const sendResponse = (
  res: Response,
  data: any,
  message: any,
  statusCode: number,
  status: 'error' | 'success'
) => {
  res.status(statusCode).send({
    message,
    data,
    status,
  });
};
