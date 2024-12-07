/* eslint-disable no-unused-vars */
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(404, "Admission semester not found")
  }

  //transaction and rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction()

    //generate id
    userData.id = await generateStudentId(admissionSemester);
  
    //create a user (transaction-1)
    const newUser = await User.create([userData], {session}); //age chilo object transaction user korar jonno array hoise
  
    //create a student
    if (!newUser.length) {
      throw new AppError(400, "Failed to create user")
    }
      //set id, _id as user
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id; //reference _id
  
      //create a student (transaction-2)
      const newStudent = await Student.create([payload], { session });
      if (!newStudent.length) {
        throw new AppError(400, "Failed to create student")
      }

      await session.commitTransaction();
      await session.endSession();
      return newStudent;
    
    
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession()
  }


};

export const UserServices = {
  createStudentIntoDB,
};
