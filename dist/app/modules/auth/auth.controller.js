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
exports.authController = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const setCookies_1 = require("../../utils/setCookies");
const userToken_1 = require("../../utils/userToken");
const auth_services_1 = require("./auth.services");
const registerUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const payload = Object.assign(Object.assign({}, JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data)), { avatar: (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.path });
    const result = yield auth_services_1.authServices.registerAsUser(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Rider Created Done",
        statusCode: 201,
        data: result,
    });
}));
const registerAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const payload = Object.assign(Object.assign({}, JSON.parse((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.data)), { avatar: (_d = req === null || req === void 0 ? void 0 : req.file) === null || _d === void 0 ? void 0 : _d.path });
    //   console.log(payload);
    const result = yield auth_services_1.authServices.registerAdmin(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Admin Created Done",
        statusCode: 201,
        data: result,
    });
}));
const verifyUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.params.email;
    //   console.log(payload);
    const result = yield auth_services_1.authServices.verifyUser(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User Verified Done",
        statusCode: 200,
        data: result,
    });
}));
const registerDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    const payload = Object.assign(Object.assign({}, JSON.parse((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.data)), { avatar: (_f = req === null || req === void 0 ? void 0 : req.files) === null || _f === void 0 ? void 0 : _f[0].path, vehicleImage: (_g = req === null || req === void 0 ? void 0 : req.files) === null || _g === void 0 ? void 0 : _g[1].path });
    const result = yield auth_services_1.authServices.registerAsDriver(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Driver Created Done",
        statusCode: 201,
        data: result,
    });
}));
const login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield auth_services_1.authServices.login(payload);
    const token = (0, userToken_1.createUserToken)(result);
    (0, setCookies_1.setCookies)(res, token);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User Login Done",
        statusCode: 200,
        data: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        },
    });
}));
const sendForgetPassOTP = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body.email;
    const result = yield auth_services_1.authServices.sendForgetPassOTP(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Forget Password OTP Send",
        statusCode: 200,
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const password = req.body.password;
    const result = yield auth_services_1.authServices.resetPassword(email, otp, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Password Reset Done",
        statusCode: 200,
        data: result,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User Logout Done",
        statusCode: 200,
        data: "",
    });
}));
const googleLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.user);
    const user = req.user;
    if (!user) {
        throw new AppError_1.AppError(401, "user not found");
    }
    const token = yield (0, userToken_1.createUserToken)(user);
    yield (0, setCookies_1.setCookies)(res, token);
    res.redirect(`${config_1.default.FRONTEND_URL}`);
}));
exports.authController = {
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
