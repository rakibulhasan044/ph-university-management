import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../utils/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty

)
export const UserRoutes = router;
