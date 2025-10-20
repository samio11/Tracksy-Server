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
exports.paymentServices = void 0;
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatepayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query === null || query === void 0 ? void 0 : query.transactionId }, { status: payment_interface_1.EPaymentStatus.complete }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "Payment Created Done",
            success: true,
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatepayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query === null || query === void 0 ? void 0 : query.transactionId }, { status: payment_interface_1.EPaymentStatus.fail }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "Payment Created fail",
            success: true,
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatepayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query === null || query === void 0 ? void 0 : query.transactionId }, { status: payment_interface_1.EPaymentStatus.cancel }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "Payment is canceled",
            success: true,
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const getAllPaymentData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.find().populate("cartId");
    return result;
});
exports.paymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    getAllPaymentData,
};
