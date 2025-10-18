"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("../ride/ride.interface");
const paymentSchema = new mongoose_1.Schema({
    ride: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Ride" },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(ride_interface_1.ERideStatus) },
    transactionId: { type: String },
    invoiceUrl: { type: String },
}, { versionKey: false, timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
