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
exports.ratingServices = void 0;
const AppError_1 = require("../../errors/AppError");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const rating_model_1 = require("./rating.model");
const createRating = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existRide = yield ride_model_1.Ride.findById(payload.ride);
    if (!existRide) {
        throw new AppError_1.AppError(401, "Ride is not available");
    }
    const existRider = yield user_model_1.User.findById(payload.from);
    if (!existRider) {
        throw new AppError_1.AppError(401, "User not found");
    }
    if (existRider.role !== user_interface_1.ERole.rider) {
        throw new AppError_1.AppError(401, "Not Valid Rider");
    }
    const existDriver = yield user_model_1.User.findById(payload.to);
    if (!existDriver) {
        throw new AppError_1.AppError(401, "User not found");
    }
    if (existDriver.role !== user_interface_1.ERole.driver) {
        throw new AppError_1.AppError(401, "Not Valid Driver");
    }
    const result = yield rating_model_1.Rating.create(payload);
    return result;
});
const getAllRating = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ratingQuery = new QueryBuilder_1.QueryBuilder(rating_model_1.Rating.find(), query);
    const ratingData = ratingQuery
        .filter()
        // .search(["score"])
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        ratingData.build().populate("from").populate("to"),
        ratingData.getMetaData(),
    ]);
    return { data, meta };
});
const getUserRating = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const existRide = yield rating_model_1.Rating.find({ from: riderId });
    if (!existRide) {
        throw new AppError_1.AppError(401, "Riders Ride is not available");
    }
    return existRide;
});
exports.ratingServices = { createRating, getAllRating, getUserRating };
