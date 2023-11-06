import {Router} from 'express';
import adminRouter from './admin.route';
import studentRouter from './student.route';
import schoolRouter from './school.route';

const v1Router = Router();
v1Router.use('/admin', adminRouter);
v1Router.use('/student', studentRouter);
v1Router.use('/school', schoolRouter);

export {v1Router};
