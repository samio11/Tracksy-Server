"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidatorError = void 0;
const handleValidatorError = (err) => {
    const errorSources = Object.values(err === null || err === void 0 ? void 0 : err.errors).map((x) => {
        return {
            path: x.path,
            message: x.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Validator Error",
        errorSources,
    };
};
exports.handleValidatorError = handleValidatorError;
