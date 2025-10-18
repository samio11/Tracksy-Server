"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = exports.ratingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ratingSchema = new mongoose_1.Schema({
    ride: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Ride" },
    from: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    to: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    score: { type: Number, required: true },
    comment: { type: String, required: true },
}, { versionKey: false, timestamps: true });
exports.Rating = (0, mongoose_1.model)("Rating", exports.ratingSchema);
