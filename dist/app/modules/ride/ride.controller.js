"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ride_services_1 = require("./ride.services");
const createRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield ride_services_1.rideServices.createRide(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Create Ride Done!!",
        statusCode: 201,
        data: result,
    });
}));
const adminSendDiscountOTP = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const result = yield ride_services_1.rideServices.adminSendDiscountOTP(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Discount OTP send!!",
        statusCode: 200,
        data: result,
    });
}));
const acceptRideByDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.body.rideId;
    const { id } = req.user; // Driver Id
    const result = yield ride_services_1.rideServices.acceptRideByDriver(rideId, id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "A Driver Accepted the ride!!",
        statusCode: 200,
        data: result,
    });
}));
const startRideByDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.body.rideId;
    const { id } = req.user; // Driver Id
    const result = yield ride_services_1.rideServices.startRideByDriver(rideId, id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "This Driver Start the ride!!",
        statusCode: 200,
        data: result,
    });
}));
const completeRideByDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.body.rideId;
    const { id } = req.user; // Driver Id
    const result = yield ride_services_1.rideServices.completeRideByDriver(rideId, id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "This Driver Completed the ride!!",
        statusCode: 200,
        data: result,
    });
}));
const cancelRideByRider = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.body.rideId;
    const { id } = req.user; // Rider Id
    const result = yield ride_services_1.rideServices.cancelRide(rideId, id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "This User Cancel the ride!!",
        statusCode: 200,
        data: result,
    });
}));
const findAllRidesData = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield ride_services_1.rideServices.findAllRidesData(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Retrived All ride!!",
        statusCode: 200,
        data: result,
    });
}));
exports.rideController = {
    createRide,
    adminSendDiscountOTP,
    acceptRideByDriver,
    startRideByDriver,
    completeRideByDriver,
    cancelRideByRider,
    findAllRidesData,
};
