import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationService } from "./semesterRegistration.service";


const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await SemesterRegistrationService.createSemesterRegistrationIntoDB(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Semester registration is created successfully",
        data: result
    })
})

export const SemesterRegistrationController = {
    createSemesterRegistration
}