import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { RegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  //check if there any register semester that is already "UPCOMING" or "ONGOING"

  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      400,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }
  //check if the semester exists
  const academicSemester = payload?.academicSemester;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(academicSemester);

  if (isSemesterRegistrationExists) {
    throw new AppError(400, 'This semester is already registered !!');
  }

  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(404, 'This academic semester not found !!');
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check if the requested semester exist

  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExist) {
    throw new AppError(404, 'This semester registration in not found');
  }
  //if the requested semester status is ended
  const currentRequestedSemester = isSemesterRegistrationExist?.status;
  const requestedStatus = payload?.status;

  if (currentRequestedSemester === RegistrationStatus.ENDED) {
    throw new AppError(
      400,
      `This semester is already ${currentRequestedSemester}`,
    );
  }

  //UPCOMING --> ONGOING --> ENDED
  if (
    currentRequestedSemester === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      400,
      `Can not directly change status from upcoming to ended`,
    );
  }

  if (
    currentRequestedSemester === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(400, `Can not change status from ONGOING to UPCOMING`);
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
