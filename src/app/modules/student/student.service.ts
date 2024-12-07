/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find().populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};

const deletedStudentFromDb = async (id: string) => {

  const isStudentExist = await Student.findOne({id});

  if(!isStudentExist) {
    throw new AppError(404, "This student does not exist !!");
  }

  const session = await mongoose.startSession();

  try {

    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session});

    if(!deletedStudent) {
      throw new AppError(400, "Failed to delete student")
    }

    const deletedUser = await User.findOneAndUpdate({id}, { isDeleted: true }, {new: true, session });

    if(!deletedUser) {
      throw new AppError(400, "Failed to delete user")
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {

    await session.abortTransaction();
    await session.endSession()
    
  }

};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deletedStudentFromDb,
};
