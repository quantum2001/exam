"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const school_controller_1 = require("../controllers/school.controller");
const schoolRouter = (0, express_1.Router)();
const authSchoolRouter = (0, express_1.Router)();
// Unauthenticated routes
schoolRouter.post('/register', school_controller_1.register);
schoolRouter.post('/login', school_controller_1.login);
// Authenticated routes
authSchoolRouter.patch('/me', school_controller_1.updateSchool);
authSchoolRouter.get('/me', school_controller_1.getSchool);
authSchoolRouter.post('/students', school_controller_1.createStudent);
authSchoolRouter.get('/students', school_controller_1.getAllStudents);
authSchoolRouter.get('/students/:id', school_controller_1.getStudent);
authSchoolRouter.patch('/students/:id', school_controller_1.updateStudent);
authSchoolRouter.delete('/students/:id', school_controller_1.deleteStudent);
authSchoolRouter.post('/classes', school_controller_1.createClass);
authSchoolRouter.get('/classes', school_controller_1.getAllClasses);
authSchoolRouter.delete('/classes/:id', school_controller_1.deleteClass);
authSchoolRouter.get('/classes/:id', school_controller_1.getClass);
authSchoolRouter.patch('/classes/:id', school_controller_1.updateClass);
authSchoolRouter.get('/classes/:id/students', school_controller_1.getAllStudentsByClass);
authSchoolRouter.post('/exams', school_controller_1.createExam);
authSchoolRouter.get('/exams', school_controller_1.getAllExams);
authSchoolRouter.get('/exams/:id', school_controller_1.getExam);
authSchoolRouter.post('/exams/:id/grade', school_controller_1.gradeExam);
authSchoolRouter.get('/exams/:id/download', school_controller_1.downloadResult);
authSchoolRouter.patch('/exams/:id', school_controller_1.updateExam);
authSchoolRouter.delete('/exams/:id', school_controller_1.deleteExam);
authSchoolRouter.post('/exams/:id/start', school_controller_1.startExam);
authSchoolRouter.post('/exams/:id/end', school_controller_1.endExam);
authSchoolRouter.post('/exams/questions', school_controller_1.createExamQuestion);
authSchoolRouter.get('/exams/questions/all/:exam_id', school_controller_1.getAllExamQuestions);
authSchoolRouter.get('/exams/questions/:id', school_controller_1.getSingleExamQuestion);
authSchoolRouter.patch('/exams/questions/:id', school_controller_1.updateExamQuestion);
authSchoolRouter.delete('/exams/questions/:id', school_controller_1.deleteExamQuestion);
// Including middleware to auth routes
schoolRouter.use('/', auth_middleware_1.verifySchool, authSchoolRouter);
exports.default = schoolRouter;
//# sourceMappingURL=school.routes.js.map