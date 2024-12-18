import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester registration is created successfully',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
      req.query,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Semester registration is fetched successfully',
    data: result,
  });
});

const getSingleSemesterRegistrations = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester registration is retrieved successfully',
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester registration update successfully',
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistrations,
  updateSemesterRegistration,
};
