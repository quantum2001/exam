"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const student_controller_1 = require("../controllers/student.controller");
const studentRouter = (0, express_1.Router)();
const authStudentRouter = (0, express_1.Router)();
// Unauthenicated
studentRouter.post('/login', student_controller_1.login);
studentRouter.get('/schools', student_controller_1.getAllSchools);
// Authenticated
authStudentRouter.post('/answer/:session_id', student_controller_1.submitAnswer);
// Including middleware to auth routes
studentRouter.use('/', auth_middleware_1.verifyStudent, authStudentRouter);
exports.default = studentRouter;
//# sourceMappingURL=student.routes.js.map