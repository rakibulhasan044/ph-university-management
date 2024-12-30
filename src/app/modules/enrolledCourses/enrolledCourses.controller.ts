import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourses.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is enrolled successfully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
