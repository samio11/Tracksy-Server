"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = require("mongoose");
const vehicle_interface_1 = require("./vehicle.interface");
const vehicleSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    maxCapacity: { type: Number, default: 0 },
    vehicleImage: { type: String, required: true },
    type: { type: String, enum: Object.values(vehicle_interface_1.EVehicleType), required: true },
}, { versionKey: false, timestamps: true });
exports.Vehicle = (0, mongoose_1.model)("Vehicle", vehicleSchema);
