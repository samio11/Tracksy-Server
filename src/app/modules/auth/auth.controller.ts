import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.services";

const registerUser = catchAsync(async (req, res, next) => {
  const payload = {
    ...JSON.parse(req?.body?.data),
    avatar: req?.file?.path,
  };
  const result = await authServices.registerAsUser(payload);
  sendResponse(res, {
    success: true,
    message: "Rider Created Done",
    statusCode: 201,
    data: result,
  });
});
const registerDriver = catchAsync(async (req, res, next) => {
  const payload = {
    ...JSON.parse(req?.body?.data),
    avatar: (req?.files as Express.Multer.File[])?.[0].path,
    vehicleImage: (req?.files as Express.Multer.File[])?.[1].path,
  };
  const result = await authServices.registerAsDriver(payload);
  sendResponse(res, {
    success: true,
    message: "Driver Created Done",
    statusCode: 201,
    data: result,
  });
});

export const authController = { registerUser, registerDriver };
