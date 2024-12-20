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

export const AuthControllers = {
    loginUser
}