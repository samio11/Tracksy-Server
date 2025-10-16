import { model, Schema } from "mongoose";
import { EVehicleType, IVehicle } from "./vehicle.interface";

const vehicleSchema = new Schema<IVehicle>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    maxCapacity: { type: Number, default: 0 },
    vehicleImage: { type: String, required: true },
    type: { type: String, enum: Object.values(EVehicleType), required: true },
  },
  { versionKey: false, timestamps: true }
);

export const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);
