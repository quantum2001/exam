import {Router} from 'express';
import {verifyStudent} from '../middlewares/auth.middleware';
import {
  getAllSchools,
  login,
  submitAnswer,
} from '../controllers/student.controller';

const studentRouter = Router();
const authStudentRouter = Router();

// Unauthenicated
studentRouter.post('/login', login);
studentRouter.get('/schools', getAllSchools);

// Authenticated
authStudentRouter.post('/answer/:session_id', submitAnswer);

// Including middleware to auth routes
studentRouter.use('/', verifyStudent, authStudentRouter);

export default studentRouter;
