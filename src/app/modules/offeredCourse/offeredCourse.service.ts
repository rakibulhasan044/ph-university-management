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
    section,
    days,
    startTime,
    endTime,
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
    _id: academicDepartment,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      404,
      `This ${isAcademicDepartmentExist.name} do not belong to the ${isAcademicFacultyExist.name}`,
    );
  }

  //check if the same duplicate section exists for the same course
  const isDuplicateSectionExist = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (isDuplicateSectionExist) {
    throw new AppError(400, `Offered course already has section ${section}`);
  }

  //get the schedules of the faculties
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }
  }).select('days startTime endTime');
  // console.log(assignedSchedules);

  const newSchedule = {
    days,
    startTime,
    endTime
  }

  assignedSchedules.forEach((schedule) => {
    const existingStartTime = new Date(`2001-01-01T${schedule.startTime}:00`);
    const existingEndTime = new Date(`2001-01-01T${schedule.endTime}:00`);
    const newStartTime = new Date(`2001-01-01T${newSchedule.startTime}:00`);
    const newEndTime = new Date(`2001-01-01T${newSchedule.endTime}:00`);

    if(newStartTime < existingEndTime && newEndTime > existingStartTime) {
      throw new AppError(400, 'This faculty is not available at that time ! choose other time or day')
    }
  })
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
  // return null;
};

export const offeredCourseServices = {
  createOfferedCoursedIntoDB,
};
