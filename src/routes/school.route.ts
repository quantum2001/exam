import {Router} from 'express';
import {verifySchool} from '../middlewares/auth.middleware';
import {
  createClass,
  createExam,
  createExamQuestion,
  createStudent,
  deleteClass,
  deleteExam,
  deleteExamQuestion,
  deleteStudent,
  downloadResult,
  endExam,
  getAllClasses,
  getAllExamQuestions,
  getAllExams,
  getAllStudents,
  getClass,
  getExam,
  getSchool,
  getSingleExamQuestion,
  getStudent,
  login,
  register,
  startExam,
  updateClass,
  updateExam,
  updateExamQuestion,
  updateSchool,
  updateStudent,
} from '../controllers/school.controller';

const schoolRouter = Router();
const authSchoolRouter = Router();
// Unauthenticated routes
schoolRouter.post('/register', register);
schoolRouter.post('/login', login);

// Authenticated routes
authSchoolRouter.patch('/me', updateSchool);
authSchoolRouter.get('/me', getSchool);
authSchoolRouter.post('/students', createStudent);
authSchoolRouter.get('/students', getAllStudents);
authSchoolRouter.get('/students/:id', getStudent);
authSchoolRouter.patch('/students/:id', updateStudent);
authSchoolRouter.delete('/students/:id', deleteStudent);
authSchoolRouter.post('/classes', createClass);
authSchoolRouter.get('/classes', getAllClasses);
authSchoolRouter.delete('/classes/:id', deleteClass);
authSchoolRouter.get('/classes/:id', getClass);
authSchoolRouter.patch('/classes/:id', updateClass);
authSchoolRouter.post('/exams', createExam);
authSchoolRouter.get('/exams', getAllExams);
authSchoolRouter.get('/exams/:id', getExam);
authSchoolRouter.get('/exams/:id/download', downloadResult);
authSchoolRouter.patch('/exams/:id', updateExam);
authSchoolRouter.delete('/exams/:id', deleteExam);
authSchoolRouter.post('/exams/:id/start', startExam);
authSchoolRouter.post('/exams/:id/end', endExam);
authSchoolRouter.post('/exams/questions', createExamQuestion);
authSchoolRouter.get('/exams/questions/all/:exam_id', getAllExamQuestions);
authSchoolRouter.get('/exams/questions/:id', getSingleExamQuestion);
authSchoolRouter.patch('/exams/questions/:id', updateExamQuestion);
authSchoolRouter.delete('/exams/questions/:id', deleteExamQuestion);

// Including middleware to auth routes
schoolRouter.use('/', verifySchool, authSchoolRouter);

export default schoolRouter;
