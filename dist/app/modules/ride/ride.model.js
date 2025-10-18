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
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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
rideSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.rideHistory.push({ status: ride_interface_1.ERideStatus.requested, time: new Date() });
        next();
    });
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
