import sendResponse from '../../utilities/send-response';
import httpStatus from 'http-status';
import catchAsync from '../../utilities/catch-async';
import { AcademicSemesterServices } from './academic-sem-services';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterInDb(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic semester is created successfully!!',
    success: true,
    data: result,
  });
});

const getAllAcademicSemesterData = catchAsync(async (req, res) => {

    const data = await AcademicSemesterServices.getAllAcademicSemesterFromDb()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'All academic semester data retrieved successfully!!',
      success: true,
      data: data,
    });
})
const getSingleSemesterData = catchAsync(async (req, res) => {
    const id = req.params.semesterId
    const data = await AcademicSemesterServices.getSingleSemesterDataFromDb(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Data retrieved successfully!!',
      success: true,
      data: data,
    });
})

const updateSingleSemesterData = catchAsync(async (req, res) => {
    const id = req.params.semesterId;
    const data = await AcademicSemesterServices.updateSingleDataInDb(id, req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Data updated successfully!!',
      success: true,
      data: data,
    });
})

export const AcademicSemesterController = {
  createAcademicSemester, getAllAcademicSemesterData,getSingleSemesterData,updateSingleSemesterData
};
