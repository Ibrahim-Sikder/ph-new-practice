import express from 'express';
import { UserControllers } from './user.controller';
import { validateRequest } from '../../../utils/validateRequest';
import { studentValidations } from '../student/student.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { USER_ROLE } from './user.constant';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post('/create-student', auth(USER_ROLE.admin), validateRequest(studentValidations.createStudentValidationSchema), UserControllers.createStudent);
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),

  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;