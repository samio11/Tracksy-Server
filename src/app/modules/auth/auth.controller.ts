import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setCookies } from "../../utils/setCookies";
import { createUserToken } from "../../utils/userToken";
import { ERole } from "../user/user.interface";
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
const registerAdmin = catchAsync(async (req, res, next) => {
  const payload = {
    ...JSON.parse(req?.body?.data),
    avatar: req?.file?.path,
  };
  //   console.log(payload);
  const result = await authServices.registerAdmin(payload);
  sendResponse(res, {
    success: true,
    message: "Admin Created Done",
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
const login = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await authServices.login(payload);

  const token = createUserToken(result);
  setCookies(res, token);
  sendResponse(res, {
    success: true,
    message: "User Login Done",
    statusCode: 200,
    data: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    },
  });
});

export const authController = {
  registerUser,
  registerDriver,
  registerAdmin,
  login,
};
