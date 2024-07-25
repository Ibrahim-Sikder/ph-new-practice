import express from 'express';
import { StudentControllers } from './student.controller';
import { validateRequest } from '../../../utils/validateRequest';
import { studentValidations } from './student.validation';


const router = express.Router();

router.get('/:studentId', StudentControllers.getSingleStudent);

router.delete('/:studentId', StudentControllers.deleteStudent);
router.patch('/:studentId',validateRequest(studentValidations.updateStudentValidationSchema), StudentControllers.updateStudent);

router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;