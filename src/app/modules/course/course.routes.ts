import express from 'express';
import validateRequest from '../../utils/validateRequest';
import { CourseValidation } from './course.validation';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.post(
    '/create-course',
    validateRequest(CourseValidation.createCourseValidationSchema),
    CourseControllers.createCourse
)

router.get('/:id', CourseControllers.getSingleCourse)

router.get('/', CourseControllers.getAllCourses)

router.delete('/:id', CourseControllers.deleteCourse)

router.patch(
    '/:id', 
    validateRequest(CourseValidation.updateCourseValidationSchema),
    CourseControllers.updateCourse)

export const CourseRoutes = router