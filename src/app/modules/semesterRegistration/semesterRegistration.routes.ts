import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.post(
    '/create-semester-registration',
    validateRequest(SemesterRegistrationValidation.createSemesterRegistrationValidationSchema),
    SemesterRegistrationController.createSemesterRegistration
)



export const SemesterRegistrationRoutes = router;