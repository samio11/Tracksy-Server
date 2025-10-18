import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.services";

const adminChangeUserVerification = catchAsync(async (req, res, next) => {
  const { userId, isVerify } = req.body;
  const result = await userServices.adminChangeUserVerification(
    userId,
    isVerify
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User verification Changed",
    data: result,
  });
});
const adminDeleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const result = await userServices.adminDeleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Delete Done",
    data: result,
  });
});

export const userControllers = { adminChangeUserVerification, adminDeleteUser };
