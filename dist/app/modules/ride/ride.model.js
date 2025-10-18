"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const driver_model_1 = require("../driver/driver.model");
const rideHistorySchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(ride_interface_1.ERideStatus),
        default: ride_interface_1.ERideStatus.requested,
    },
    time: { type: Date, default: Date.now() },
}, { versionKey: false });
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    driver: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    startRide: { type: driver_model_1.locationSchema },
    endRide: { type: driver_model_1.locationSchema },
    distance: { type: Number },
    duration: { type: Number },
    fare: { type: Number },
    rideStatus: {
        type: String,
        enum: Object.values(ride_interface_1.ERideStatus),
        default: ride_interface_1.ERideStatus.requested,
    },
    rideHistory: { type: [rideHistorySchema] },
    promoCode: { type: String },
}, { versionKey: false, timestamps: true });
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
