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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const config_1 = __importDefault(require("../../config"));
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = require("../../errors/AppError");
const sendEmail_1 = require("../../utils/sendEmail");
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const vehicle_model_1 = require("../vehicle/vehicle.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerAsUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    yield (0, sendEmail_1.sendEmail)({
        to: result.email,
        subject: "Welcome to Tracksy 🚗 - Verify Your Account",
        tempFileName: "welcome",
        tempFileData: {
            name: result.name,
            email: result.email,
            profilePic: result.avatar,
            verifyLink: `http://localhost:5000/api/v1/auth/verify/${payload.email}`,
            logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
        },
    });
    return result;
});
const registerAsDriver = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const newUser = yield user_model_1.User.create([
            {
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                password: payload.password,
                role: user_interface_1.ERole.driver,
                avatar: payload.avatar,
                isVerified: true,
            },
        ], { session });
        const newVehicle = yield vehicle_model_1.Vehicle.create([
            {
                owner: (_a = newUser[0]) === null || _a === void 0 ? void 0 : _a._id,
                model: payload.model,
                year: payload.year,
                maxCapacity: payload.maxCapacity,
                vehicleImage: payload.vehicleImage,
                type: payload.type,
            },
        ], { session });
        const newDriver = yield driver_model_1.Driver.create([
            {
                user: (_b = newUser[0]) === null || _b === void 0 ? void 0 : _b._id,
                vehicle: (_c = newVehicle[0]) === null || _c === void 0 ? void 0 : _c._id,
                licenseNumber: payload.licenseNumber,
                status: payload.status,
                location: payload.location,
                rating: payload.rating,
                acceptedRide: payload.acceptedRide,
            },
        ]);
        const updateUserDriverProfile = yield user_model_1.User.findByIdAndUpdate((_d = newUser[0]) === null || _d === void 0 ? void 0 : _d._id, { driverProfile: (_e = newDriver[0]) === null || _e === void 0 ? void 0 : _e._id }, { new: true, session });
        yield (0, sendEmail_1.sendEmail)({
            to: updateUserDriverProfile === null || updateUserDriverProfile === void 0 ? void 0 : updateUserDriverProfile.email,
            subject: "Welcome to Tracksy 🚗 - Verify Your Account",
            tempFileName: "welcome",
            tempFileData: {
                name: updateUserDriverProfile === null || updateUserDriverProfile === void 0 ? void 0 : updateUserDriverProfile.name,
                email: updateUserDriverProfile === null || updateUserDriverProfile === void 0 ? void 0 : updateUserDriverProfile.email,
                profilePic: updateUserDriverProfile === null || updateUserDriverProfile === void 0 ? void 0 : updateUserDriverProfile.avatar,
                verifyLink: `http://localhost:5000/api/v1/auth/verify/${updateUserDriverProfile === null || updateUserDriverProfile === void 0 ? void 0 : updateUserDriverProfile.email}`,
                logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
            },
        });
        yield session.commitTransaction();
        session.endSession();
        return updateUserDriverProfile;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        console.log("Driver Registration Failed", err);
        throw err;
    }
});
const registerAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPayload = Object.assign(Object.assign({}, payload), { role: user_interface_1.ERole.admin });
    //   https://i.ibb.co/XZwMnkH1/tracksy.jpg
    const result = yield user_model_1.User.create(updatedPayload);
    yield (0, sendEmail_1.sendEmail)({
        to: result.email,
        subject: "Welcome to Tracksy 🚗 - Verify Your Account",
        tempFileName: "welcome",
        tempFileData: {
            name: result.name,
            email: result.email,
            profilePic: result.avatar,
            verifyLink: `http://localhost:5000/api/v1/auth/verify/${payload.email}`,
            logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
        },
    });
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findOne({ email: payload.email });
    if (!existUser) {
        throw new AppError_1.AppError(401, "User is not exists");
    }
    const passMatch = yield bcrypt_1.default.compare(payload.password, existUser.password);
    if (!passMatch) {
        throw new AppError_1.AppError(401, "Invalid Password");
    }
    if (existUser.isVerified === false) {
        throw new AppError_1.AppError(401, "Please Verify...");
    }
    return existUser;
});
const verifyUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findOne({ email: payload });
    if (!existUser) {
        throw new AppError_1.AppError(401, "User is not exists");
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email: existUser.email }, { isVerified: true }, { new: true });
    return result;
});
const sendForgetPassOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findOne({ email });
    if (!existUser) {
        throw new AppError_1.AppError(401, "User is not available");
    }
    if (existUser.isVerified === false) {
        throw new AppError_1.AppError(401, "Please Verify First");
    }
    const otp = Math.floor(Math.random() * 999999) + 100000;
    const otp_name = `otp_${existUser.email}`;
    yield redis_config_1.redisClient.set(otp_name, otp, {
        expiration: {
            type: "EX",
            value: 120,
        },
    });
    yield (0, sendEmail_1.sendEmail)({
        to: existUser.email,
        subject: "Tracksy - Password Reset OTP 🔐",
        tempFileName: "forgotPasswordOTP",
        tempFileData: {
            email: existUser.email,
            otp: otp,
            logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
        },
    });
});
const resetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.User.findOne({ email });
    if (!existUser) {
        throw new AppError_1.AppError(401, "User is not available");
    }
    const otp_name = `otp_${existUser.email}`;
    const stored_otp = yield redis_config_1.redisClient.get(otp_name);
    if (!stored_otp) {
        throw new AppError_1.AppError(401, "OTP is Invalid now. Please resend otp again or check otp again");
    }
    if (stored_otp !== otp) {
        throw new AppError_1.AppError(401, "OTP is not matched");
    }
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.BCRYPT_SALT));
    const result = yield user_model_1.User.findOneAndUpdate({ email: existUser.email }, { password: hashPassword, isVerified: true }, { new: true });
    return result;
});
exports.authServices = {
    registerAsDriver,
    registerAsUser,
    registerAdmin,
    login,
    verifyUser,
    sendForgetPassOTP,
    resetPassword,
};
