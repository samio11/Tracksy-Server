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
exports.userServices = exports.getAdminStats = void 0;
const AppError_1 = require("../../errors/AppError");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("../ride/ride.model");
const vehicle_model_1 = require("../vehicle/vehicle.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const adminChangeUserVerification = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findById(userId);
    if (!existUser) {
        throw new AppError_1.AppError(401, "Invalid User");
    }
    const updateUserStatus = yield user_model_1.User.findByIdAndUpdate(userId, { isVerified: status }, { new: true });
    return updateUserStatus;
});
const adminDeleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const existUser = yield user_model_1.User.findById(userId);
        if (!existUser) {
            throw new AppError_1.AppError(401, "User is not exists");
        }
        if (existUser.role === user_interface_1.ERole.driver) {
            const existDriver = yield driver_model_1.Driver.findById(existUser.driverProfile);
            const existVehicle = yield vehicle_model_1.Vehicle.findById(existDriver === null || existDriver === void 0 ? void 0 : existDriver._id);
            yield vehicle_model_1.Vehicle.findByIdAndDelete(existVehicle === null || existVehicle === void 0 ? void 0 : existVehicle._id);
            yield driver_model_1.Driver.findByIdAndDelete(existDriver === null || existDriver === void 0 ? void 0 : existDriver._id);
            yield user_model_1.User.findByIdAndDelete(existUser === null || existUser === void 0 ? void 0 : existUser._id);
            return "";
        }
        const result = yield user_model_1.User.findByIdAndDelete(userId);
        yield session.commitTransaction();
        session.endSession();
        return "";
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
// Delete Driver Car Info
const deleteDriverVehicle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.Vehicle.findByIdAndDelete(payload, { new: true });
    return "";
});
const createDriverVehicle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_model_1.Vehicle.create(payload);
    return result;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const userData = yield userQuery
        .filter()
        .search(["email"])
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        userData.build(),
        userData.getMetaData(),
    ]);
    return { data, meta };
});
const getAUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield ((_a = user_model_1.User.findById(id)) === null || _a === void 0 ? void 0 : _a.populate({
        path: "driverProfile",
        populate: {
            path: "vehicle",
            model: "Vehicle",
        },
    }));
    return result;
});
const updateUserData = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const getAdminStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    // Total rides and total income
    const rideStats = yield ride_model_1.Ride.aggregate([
        {
            $group: {
                _id: null,
                totalRides: { $sum: 1 },
                totalIncome: { $sum: "$fare" },
            },
        },
    ]);
    // Total users
    const totalUsers = yield user_model_1.User.countDocuments({ role: user_interface_1.ERole.rider });
    const totalDrivers = yield user_model_1.User.countDocuments({ role: user_interface_1.ERole.driver });
    // Optional: Rides by day for chart
    const ridesByDay = yield ride_model_1.Ride.aggregate([
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                rides: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                date: "$_id",
                rides: 1,
                _id: 0,
            },
        },
    ]);
    return {
        totalRides: ((_b = rideStats[0]) === null || _b === void 0 ? void 0 : _b.totalRides) || 0,
        totalIncome: ((_c = rideStats[0]) === null || _c === void 0 ? void 0 : _c.totalIncome) || 0,
        totalUsers,
        totalDrivers,
        ridesByDay,
    };
});
exports.getAdminStats = getAdminStats;
const getAUserRideCount = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield ride_model_1.Ride.findOne({ rider: riderId });
    if (!existUser) {
        throw new AppError_1.AppError(401, "User is not Found");
    }
    const result = yield ride_model_1.Ride.countDocuments({ rider: riderId });
    return { rideCount: result };
});
exports.userServices = {
    adminChangeUserVerification,
    adminDeleteUser,
    deleteDriverVehicle,
    createDriverVehicle,
    getAllUser,
    getAUser,
    updateUserData,
    getAdminStats: exports.getAdminStats,
    getAUserRideCount,
};
