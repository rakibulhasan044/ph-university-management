import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourses.validation';
import { EnrolledCourseControllers } from './enrolledCourses.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  auth('faculty'),
  validateRequest(EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema),
  EnrolledCourseControllers.updateEnrolledCourseMArks
)

export const EnrolledCourseRoutes = router;
