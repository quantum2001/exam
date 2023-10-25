import { Router } from "express";
import { verifySchool } from "../middlewares/auth.middleware";

const schoolRouter = Router();
const authSchoolRouter = Router();

// Authenticated routes
authSchoolRouter.patch("/:id");
authSchoolRouter.get("/:id")
authSchoolRouter.post("/students");
authSchoolRouter.get("/students");
authSchoolRouter.get("/students/:id");
authSchoolRouter.patch("/students/:id");
authSchoolRouter.delete("/students/:id");
authSchoolRouter.post("/exams");
authSchoolRouter.get("/exams");
authSchoolRouter.get("/exams/:id");
authSchoolRouter.patch("/exams/:id");
authSchoolRouter.delete("/exams/:id");
authSchoolRouter.post("/exams/:id/start");

schoolRouter.use("/", verifySchool, authSchoolRouter);

// Unauthenticated routes
schoolRouter.post("/register");
schoolRouter.post("/login");

export default schoolRouter;
