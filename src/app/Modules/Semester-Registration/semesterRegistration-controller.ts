import { Request, Response } from "express";
import catchAsync from "../../utilities/catch-async";
import sendResponse from "../../utilities/send-response";
import { SemesterRegistrationService } from "./semesterRegistration-services";
import httpStatus from 'http-status';
const createSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    
    const result = await SemesterRegistrationService.createSemesterRegistrationInDb(req.body)
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registered Successfully!',
      data: result,
    });
    
})
const getAllSemesterRegistration = catchAsync(async(req: Request, res: Response) => {
    const result = await SemesterRegistrationService.getAllSemesterRegistrationsFromDb(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All semester retrieved successfully',
        data : result
    })
})
const getSingleSemesterRegistration = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.getSingleSemesterRegistrationFromDb(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester retrieved successfully',
      data: result,
    });
})
const updateSemesterRegistration = catchAsync(async (req: Request, res: Response) => { 
    const { id } = req.params;
    const result = await SemesterRegistrationService.updateSemesterRegistrationIntoDb(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester updated successfully',
      data: result,
    });
})
export const semesterRegistrationController = {
    createSemesterRegistration, getAllSemesterRegistration, getSingleSemesterRegistration, updateSemesterRegistration
}
