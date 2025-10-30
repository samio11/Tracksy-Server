import { JwtPayload } from "jsonwebtoken";
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
  const { userId } = req.params;
  const result = await userServices.adminDeleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Delete Done",
    data: result,
  });
});
const deleteDriverVehicle = catchAsync(async (req, res, next) => {
  const vehicleId = req.params.id || "";
  const result = await userServices.deleteDriverVehicle(vehicleId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vehicle Delete Done",
    data: result,
  });
});
const createDriverVehicle = catchAsync(async (req, res, next) => {
  const vehicleData = req.body;
  const result = await userServices.createDriverVehicle(vehicleData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Vehicle create Done",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res, next) => {
  const query = req?.query;
  const result = await userServices.getAllUser(query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Data Getting Done",
    data: result,
  });
});
const getAUser = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const result = await userServices.getAUser(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Data Getting Done",
    data: result,
  });
});
const updateAUser = catchAsync(async (req, res, next) => {
  const { id } = req?.params;
  const payload = req.body;
  const result = await userServices.updateUserData(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Data Update Done",
    data: result,
  });
});
const getAdminStates = catchAsync(async (req, res, next) => {
  const result = await userServices.getAdminStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin Data getting Done",
    data: result,
  });
});
const getAUserRideCount = catchAsync(async (req, res, next) => {
  const { id } = req?.user as JwtPayload;
  const result = await userServices.getAUserRideCount(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Ride Count Done Done",
    data: result,
  });
});

export const userControllers = {
  adminChangeUserVerification,
  adminDeleteUser,
  deleteDriverVehicle,
  createDriverVehicle,
  getAllUser,
  getAUser,
  updateAUser,
  getAdminStates,
  getAUserRideCount,
};
