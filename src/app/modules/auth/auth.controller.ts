import config from "../../config";
import { AppError } from "../../errors/AppError";
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
const verifyUser = catchAsync(async (req, res, next) => {
  const payload = req.params.email;
  //   console.log(payload);
  const result = await authServices.verifyUser(payload);
  sendResponse(res, {
    success: true,
    message: "User Verified Done",
    statusCode: 200,
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

const sendForgetPassOTP = catchAsync(async (req, res, next) => {
  const payload = req.body.email;
  const result = await authServices.sendForgetPassOTP(payload);
  sendResponse(res, {
    success: true,
    message: "Forget Password OTP Send",
    statusCode: 200,
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const password = req.body.password;
  const result = await authServices.resetPassword(email, otp, password);
  sendResponse(res, {
    success: true,
    message: "Password Reset Done",
    statusCode: 200,
    data: result,
  });
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  sendResponse(res, {
    success: true,
    message: "User Logout Done",
    statusCode: 200,
    data: "",
  });
});

const googleLogin = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  const user = req.user;

  if (!user) {
    throw new AppError(401, "user not found");
  }
  const token = await createUserToken(user);
  await setCookies(res, token);
  res.redirect(`${config.FRONTEND_URL}`);
});

export const authController = {
  registerUser,
  registerDriver,
  registerAdmin,
  login,
  verifyUser,
  sendForgetPassOTP,
  resetPassword,
  logout,
  googleLogin,
};
