import { RequestHandler } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents: RequestHandler = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student fetched successfully',
      data: result
    })
});

const getSingleStudent: RequestHandler = catchAsync(async ( req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrieved successfully',
      data: result
    })
});

const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.deletedStudentFromDb(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student deleted successfully',
      data: result
    })
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
