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
exports.authRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const auth_controller_1 = require("./auth.controller");
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("../../config"));
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.authController.login);
router.post("/register-rider", multer_config_1.multerUpload.single("file"), auth_controller_1.authController.registerUser);
router.post("/register-admin", multer_config_1.multerUpload.single("file"), auth_controller_1.authController.registerAdmin);
router.post("/register-driver", multer_config_1.multerUpload.array("files"), auth_controller_1.authController.registerDriver);
router.get("/verify/:email", auth_controller_1.authController.verifyUser);
router.post("/send-otp", auth_controller_1.authController.sendForgetPassOTP);
router.post("/reset-password", auth_controller_1.authController.resetPassword);
router.post("/logout", auth_controller_1.authController.logout);
// Google Login
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const redirect = ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.redirect) || "/";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureMessage: `${config_1.default.FRONTEND_URL}/login`,
    session: false,
}), auth_controller_1.authController.googleLogin);
exports.authRoutes = router;
