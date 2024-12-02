import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = express.Router()

router.post('/create-academic-faculty', validateRequest(AcademicFacultyValidation.createAcademicFacultyValidationSchema), (AcademicFacultyControllers.createAcademicFaculty))

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties)

router.get('/:facultyId', AcademicFacultyControllers.getSingleFaculty)

router.patch('/:facultyId', validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty)

export const AcademicFacultyRoutes = router;
