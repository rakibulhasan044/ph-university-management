import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.createOfferedCoursedIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course is created successfully',
    data: result,
  });
});

// const getAllSemesterRegistrations = catchAsync(async (req, res) => {
//   const result =
//     await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
//       req.query,
//     );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'All Semester registration is fetched successfully',
//     data: result,
//   });
// });

// const getSingleSemesterRegistrations = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result =
//     await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(id);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Semester registration is retrieved successfully',
//     data: result,
//   });
// });

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course updated successfully',
    data: result,
  });
});

export const OfferedCourseController = {
  createOfferedCourse,
  updateOfferedCourse,
};
