import httpStatus from 'http-status';
import { options } from 'joi';
import AppError from '../../CustomError/app-error';
import QueryBuilder from '../../Query-Builder/QueryBuilder';
import { AcademicSemister } from '../Academic-Semester/academic-sem-model';
import { RegistrationStatus } from './semesterRegistration-constants';
import { TSemesterRegistration } from './semesterRegistration-interface';
import { SemesterRegistration } from './semesterRegistration-model';

const createSemesterRegistrationInDb = async (
  payload: TSemesterRegistration,
) => {
  console.log(payload)
  const academicSemester = payload?.academicSemester;
  //check if there already a semester with staus 'UPCOMING' or 'ONGOING' exists
  const checkSemesterStatus = await SemesterRegistration.findOne({
    $or : [{status : RegistrationStatus.UPCOMING},{status : RegistrationStatus.ONGOING}]
  })
  if (checkSemesterStatus) {
    throw new AppError(httpStatus.BAD_REQUEST, `There is already a semester with status ${checkSemesterStatus?.status}`)
  }
  //check if the semester exist
  const isAcademicSemesterExist =
    await AcademicSemister.findById(academicSemester);

  if (!isAcademicSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester does not exist!',
    );
  }
  const isSemesterAlreadyExist = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterAlreadyExist) {
    throw new AppError(httpStatus.CONFLICT, 'This semester already exists');
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};
const getAllSemesterRegistrationsFromDb = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields()
    const result = await semesterRegistrationQuery.modelQuery;
    return result
};

const getSingleSemesterRegistrationFromDb = async (id: string) => {
    const result = await SemesterRegistration.findById(id)
    return result
};
const updateSemesterRegistrationIntoDb = async (id: string, payload: Partial<TSemesterRegistration>) => {
  // check if the requested semester exists 
  const isSmesterRegistrationExist = await SemesterRegistration.findById(id)
  if (!isSmesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester does not exist')
  }
  // if the requested semester registration is ended
  const checkSemesterStatus = isSmesterRegistrationExist?.status
  if (checkSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, `This semester is already ${checkSemesterStatus}`)
  }
  // UPCOMING --> ONGOING --> ENDED
  const requestedStatus = payload?.status
  if (checkSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, `Can not change ${checkSemesterStatus} to ${requestedStatus}`)
  }
  if (checkSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
    throw new AppError(httpStatus.BAD_REQUEST, `Can not change ${checkSemesterStatus} to ${requestedStatus}`)
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  return result
    
};
export const SemesterRegistrationService = {
  createSemesterRegistrationInDb,
  getAllSemesterRegistrationsFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSemesterRegistrationIntoDb,
};
