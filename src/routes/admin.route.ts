import { Router } from "express";
import { verifyAdmin } from "../middlewares/auth.middleware";

const adminRouter = Router();
const authAdminRouter = Router();


// Unauthenticated route
adminRouter.post("/login");

// Authenticated routes
authAdminRouter.get("/school");
authAdminRouter.get("/school/:id");
authAdminRouter.post("/school/:id/validate");
authAdminRouter.delete("/school/:id");

// Including middleware to auth routes
adminRouter.use("/", verifyAdmin, authAdminRouter);


export default adminRouter;
