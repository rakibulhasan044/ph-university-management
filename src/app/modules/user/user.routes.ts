import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../utils/validateRequest';

const router = express.Router();



router.post(
  '/create-student',
  validateRequest(studentValidations.studentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
