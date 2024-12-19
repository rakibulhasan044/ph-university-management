import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { OfferedCourseValidation } from './offeredCourse.validation';
import { OfferedCourseController } from './offeredCourse.controller';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);

export const OfferedCourseRoutes = router;
