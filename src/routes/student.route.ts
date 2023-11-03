import { Router } from "express";
import { verifyStudent } from "../middlewares/auth.middleware";
import { endExam, login, startExam, submitAnswer } from "../controllers/student.controller";

const studentRouter = Router();
const authStudentRouter = Router();

// Unauthenicated
studentRouter.post("/login", login);

// Authenticated
authStudentRouter.post("/start-exam", startExam);
authStudentRouter.post("/end-exam", endExam);
authStudentRouter.post("/submit-answer", submitAnswer);

// Including middleware to auth routes
studentRouter.use("/", verifyStudent, authStudentRouter);

export default studentRouter;
