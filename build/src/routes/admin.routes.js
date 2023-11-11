"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const adminRouter = (0, express_1.Router)();
const authAdminRouter = (0, express_1.Router)();
// Unauthenticated route
adminRouter.post('/login', admin_controller_1.login);
// Authenticated routes
authAdminRouter.get('/schools', admin_controller_1.getAllSchools);
authAdminRouter.get('/schools/:id', admin_controller_1.getSingleSchool);
authAdminRouter.post('/schools/:id/disable', admin_controller_1.disableSchool);
authAdminRouter.post('/schools/:id/enable', admin_controller_1.enableSchool);
authAdminRouter.delete('/schools/:id', admin_controller_1.deleteSchool);
authAdminRouter.patch('/schools/:id/exam-limit', admin_controller_1.updateSchoolExamCount);
// Including middleware to auth routes
adminRouter.use('/', auth_middleware_1.verifyAdmin, authAdminRouter);
exports.default = adminRouter;
//# sourceMappingURL=admin.routes.js.map