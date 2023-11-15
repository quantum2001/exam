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
  getAllStudentsByClass,
  getClass,
  getExam,
  getRecentStudents,
  getSchool,
  getSingleExamQuestion,
  getStudent,
  gradeExam,
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
authSchoolRouter.get('/students/recent', getRecentStudents);
authSchoolRouter.get('/students/:id', getStudent);
authSchoolRouter.patch('/students/:id', updateStudent);
authSchoolRouter.delete('/students/:id', deleteStudent);
authSchoolRouter.post('/classes', createClass);
authSchoolRouter.get('/classes', getAllClasses);
authSchoolRouter.delete('/classes/:id', deleteClass);
authSchoolRouter.get('/classes/:id', getClass);
authSchoolRouter.patch('/classes/:id', updateClass);
authSchoolRouter.get('/classes/:id/students', getAllStudentsByClass);
authSchoolRouter.post('/exams', createExam);
authSchoolRouter.get('/exams', getAllExams);
authSchoolRouter.get('/exams/:id', getExam);
authSchoolRouter.post('/exams/:id/grade', gradeExam);
authSchoolRouter.get('/exams/:id/download', downloadResult);
authSchoolRouter.patch('/exams/:id', updateExam);
authSchoolRouter.delete('/exams/:id', deleteExam);
authSchoolRouter.post('/exams/:id/start', startExam);
authSchoolRouter.post('/exams/:id/end', endExam);
authSchoolRouter.post('/exams/:exam_id/questions', createExamQuestion);
authSchoolRouter.get('/exams/:exam_id/questions/all', getAllExamQuestions);
authSchoolRouter.get('/exams/:exam_id/questions/:id', getSingleExamQuestion);
authSchoolRouter.patch('/exams/:exam_id/questions/:id', updateExamQuestion);
authSchoolRouter.delete('/exams/:exam_id/questions/:id', deleteExamQuestion);

// Including middleware to auth routes
schoolRouter.use('/', verifySchool, authSchoolRouter);

export default schoolRouter;
