import { model, Schema } from "mongoose";
import { EDriverStatus, IDriver, ILocation } from "./driver.interface";

export const locationSchema = new Schema<ILocation>({
  lat: { type: Number, required: true },
  lang: { type: Number, required: true },
});

const driverSchema = new Schema<IDriver>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    licenseNumber: { type: String, required: true },
    status: {
      type: String,
      enum: {
        values: Object.values(EDriverStatus),
      },
      default: EDriverStatus.available,
    },
    location: { type: locationSchema },
    rating: { type: Number, default: 0 },
    acceptedRide: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);
