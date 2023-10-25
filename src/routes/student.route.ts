import { Router } from "express";
import { verifyStudent } from "../middlewares/auth.middleware";

const studentRouter = Router();
const authStudentRouter = Router();

// Unauthenicated
studentRouter.post("/login");

// Authenticated
authStudentRouter.post("/start-exam");
authStudentRouter.post("/end-exam");
authStudentRouter.post("/submit-answer");

// Including middleware to auth routes
studentRouter.use("/", verifyStudent, authStudentRouter);

export default studentRouter;
