"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    ride: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Ride" },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.EPaymentStatus),
        default: payment_interface_1.EPaymentStatus.pending,
    },
    transactionId: { type: String },
    invoiceUrl: { type: String },
}, { versionKey: false, timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
