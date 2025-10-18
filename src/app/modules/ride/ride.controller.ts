import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rideServices } from "./ride.services";

const createRide = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await rideServices.createRide(payload);
  sendResponse(res, {
    success: true,
    message: "Create Ride Done!!",
    statusCode: 201,
    data: result,
  });
});
const adminSendDiscountOTP = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const result = await rideServices.adminSendDiscountOTP(email);
  sendResponse(res, {
    success: true,
    message: "Discount OTP send!!",
    statusCode: 200,
    data: result,
  });
});

export const rideController = { createRide, adminSendDiscountOTP };
