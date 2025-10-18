"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const config_1 = __importDefault(require("../config"));
const jwt_1 = require("./jwt");
const createUserToken = (payload) => {
    const userData = {
        name: payload.name,
        email: payload.email,
        role: payload.role,
    };
    const accessToken = (0, jwt_1.generateToken)(userData, config_1.default.JWT_ACCESS_TOKEN, config_1.default.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(userData, config_1.default.JWT_REFRESH_TOKEN, config_1.default.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
