import {Router} from 'express';
import {verifyAdmin} from '../middlewares/auth.middleware';
import {
  deleteSchool,
  getAllSchools,
  getSingleSchool,
  login,
  disableSchool,
  enableSchool,
  updateSchoolExamCount,
} from '../controllers/admin.controller';

const adminRouter = Router();
const authAdminRouter = Router();

// Unauthenticated route
adminRouter.post('/login', login);

// Authenticated routes
authAdminRouter.get('/schools', getAllSchools);
authAdminRouter.get('/schools/:id', getSingleSchool);
authAdminRouter.post('/schools/:id/disable', disableSchool);
authAdminRouter.post('/schools/:id/enable', enableSchool);
authAdminRouter.delete('/schools/:id', deleteSchool);
authAdminRouter.patch('/schools/:id/exam-limit', updateSchoolExamCount);

// Including middleware to auth routes
adminRouter.use('/', verifyAdmin, authAdminRouter);

export default adminRouter;
