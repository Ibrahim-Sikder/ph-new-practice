

import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';

import { academicSemesterValidations } from './academicSemester.validation';

import { validateRequest } from '../../../utils/validateRequest';

const router = express.Router();
router.post('/create-academic-semester', validateRequest(academicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester)


router.get(
    '/',
    AcademicSemesterControllers.getAllAcademicSemester,
  );
  router.get(
    '/:semesterId',
    AcademicSemesterControllers.getSingleAcademicSemester,
  );
  router.delete(
    '/:semesterId',
    AcademicSemesterControllers.deleteAcademicSemester,
  );
  router.patch(
    '/:semesterId',
    validateRequest(academicSemesterValidations.updateAcademicSemesterValidationSchema),
    AcademicSemesterControllers.updateAcademicSemester,
  );
  

export const AcademicSemesterRoutes = router ;