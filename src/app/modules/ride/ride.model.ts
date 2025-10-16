import { model, Schema } from "mongoose";
import { ERideStatus, IRide, IRideHistory } from "./ride.interface";
import { locationSchema } from "../driver/driver.model";

const rideHistorySchema = new Schema<IRideHistory>(
  {
    status: {
      type: String,
      enum: Object.values(ERideStatus),
      default: ERideStatus.requested,
    },
    time: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

const rideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    driver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    startRide: { type: locationSchema },
    endRide: { type: locationSchema },
    distance: { type: Number },
    duration: { type: Number },
    fare: { type: Number },
    rideStatus: {
      type: String,
      enum: Object.values(ERideStatus),
      default: ERideStatus.requested,
    },
    rideHistory: { type: [rideHistorySchema] },
    promoCode: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export const Ride = model<IRide>("Ride", rideSchema);
