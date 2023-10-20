import { Router } from "express";
import examRouter from "./exam.route";
import adminRouter from "./admin.route";
import studentRouter from "./student.route";
import schoolRouter from "./school.route";

const v1Router = Router();
v1Router.use("/exam", examRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/student", studentRouter);
v1Router.use("/school", schoolRouter);

export { v1Router };
