import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';

const createOfferedCoursedIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section
  } = payload;
  //check if the semester registration id Exists
  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(404, 'Semester registration not found !!');
  }

  const academicSemester = isSemesterRegistrationExist?.academicSemester;

  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(404, 'Academic faculty not found !!');
  }

  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExist) {
    throw new AppError(404, 'Academic department not found !!');
  }

  const isCourseExist = await Course.findById(course);
  if (!isCourseExist) {
    throw new AppError(404, 'Course not found !!');
  }

  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(404, 'faculty not found !!');
  }

  //check if department belong to to the faculty

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(404, `This ${isAcademicDepartmentExist.name} do not belong to the ${isAcademicFacultyExist.name}`);
  }

  //check if the same duplicate section exists for the same course
  const isDuplicateSectionExist = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section
  })

  if (isDuplicateSectionExist) {
    throw new AppError(400, `Offered course already has section ${section}`);
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

export const offeredCourseServices = {
  createOfferedCoursedIntoDB,
};
