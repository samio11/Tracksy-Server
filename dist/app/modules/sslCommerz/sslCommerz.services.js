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
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(config.SSL_PAYMENT_API);
        const data = {
            store_id: config_1.default.SSL_STORE_ID,
            store_passwd: config_1.default.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${config_1.default.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${config_1.default.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${config_1.default.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            // ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address || "Nikunja-02,Dhaka",
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01709801305",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: config_1.default.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log("Payment Error Occured", error);
        throw new AppError_1.AppError(401, error.message);
    }
});
exports.SSLService = {
    sslPaymentInit,
};
