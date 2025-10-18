import { JwtPayload } from "jsonwebtoken";
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
const acceptRideByDriver = catchAsync(async (req, res, next) => {
  const rideId = req.body.rideId;
  const { id } = req.user as JwtPayload; // Driver Id
  const result = await rideServices.acceptRideByDriver(rideId, id);
  sendResponse(res, {
    success: true,
    message: "A Driver Accepted the ride!!",
    statusCode: 200,
    data: result,
  });
});
const startRideByDriver = catchAsync(async (req, res, next) => {
  const rideId = req.body.rideId;
  const { id } = req.user as JwtPayload; // Driver Id
  const result = await rideServices.startRideByDriver(rideId, id);
  sendResponse(res, {
    success: true,
    message: "This Driver Start the ride!!",
    statusCode: 200,
    data: result,
  });
});
const completeRideByDriver = catchAsync(async (req, res, next) => {
  const rideId = req.body.rideId;
  const { id } = req.user as JwtPayload; // Driver Id
  const result = await rideServices.completeRideByDriver(rideId, id);
  sendResponse(res, {
    success: true,
    message: "This Driver Completed the ride!!",
    statusCode: 200,
    data: result,
  });
});
const cancelRideByRider = catchAsync(async (req, res, next) => {
  const rideId = req.body.rideId;
  const { id } = req.user as JwtPayload; // Rider Id
  const result = await rideServices.cancelRide(rideId, id);
  sendResponse(res, {
    success: true,
    message: "This User Cancel the ride!!",
    statusCode: 200,
    data: result,
  });
});
const findAllRidesData = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await rideServices.findAllRidesData(
    query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    message: "Retrived All ride!!",
    statusCode: 200,
    data: result,
  });
});

export const rideController = {
  createRide,
  adminSendDiscountOTP,
  acceptRideByDriver,
  startRideByDriver,
  completeRideByDriver,
  cancelRideByRider,
  findAllRidesData,
};
