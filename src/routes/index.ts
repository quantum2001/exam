import {Router} from 'express';
import adminRouter from './admin.routes';
import studentRouter from './student.routes';
import schoolRouter from './school.routes';

const v1Router = Router();
v1Router.use('/admin', adminRouter);
v1Router.use('/student', studentRouter);
v1Router.use('/school', schoolRouter);

export {v1Router};
