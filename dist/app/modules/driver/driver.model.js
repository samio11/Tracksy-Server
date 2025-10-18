"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = exports.locationSchema = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
exports.locationSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lang: { type: Number, required: true },
});
const driverSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    licenseNumber: { type: String, required: true },
    status: {
        type: String,
        enum: {
            values: Object.values(driver_interface_1.EDriverStatus),
        },
        default: driver_interface_1.EDriverStatus.available,
    },
    location: { type: exports.locationSchema },
    rating: { type: Number, default: 0 },
    acceptedRide: { type: Number, default: 0 },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
