import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {

    const result = await AuthServices.loginUser(req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User login Successful",
        data: result
    })
})

const changePassword = catchAsync(async (req, res) => {

    const {...passwordData} = req.body

    const result = await AuthServices.changePassword(req.user, passwordData)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully",
        data: result,
    })
})

export const AuthControllers = {
    loginUser,
    changePassword
}