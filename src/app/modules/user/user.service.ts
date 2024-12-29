/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (file: any, password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  userData.role = 'student';
  userData.email = payload.email;

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(404, 'Admission semester not found');
  }

  //transaction and rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //generate id
    userData.id = await generateStudentId(admissionSemester);

    const imageName: string = `${userData.id}${payload?.name?.firstName}`
    const path = file?.path
    //test
    const { secure_url } = await sendImageToCloudinary(imageName, path);


    //create a user (transaction-1)
    const newUser = await User.create([userData], { session }); //age chilo object transaction user korar jonno array hoise

    //create a student
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }
    //set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    payload.profileImage = secure_url

    //create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(400, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(400, 'Failed to create student');
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  userData.role = 'faculty';
  userData.email = payload.email;

  //find faculty academic department info

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(404, 'Academic department not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();

    //create a user transaction -1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }

    //set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    //transaction-2

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(400, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given use default password
  userData.password = password || (config.default_password as string);
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set generate id
    userData.id = await generateAdminId();

    //create a user transaction-1
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser) {
      throw new AppError(400, 'Failed to create admin');
    }

    //set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    //create admin transaction-2
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin) {
      throw new AppError(400, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMeFromDB = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string)

  // const { userId, role} = decoded

  let result = null;

  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }

  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const isUserExists = await User.findById(id);

  if (!isUserExists) {
    throw new AppError(404, 'User not found');
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMeFromDB,
  changeStatus,
};
