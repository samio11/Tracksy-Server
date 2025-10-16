import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";
import { ERideStatus } from "../ride/ride.interface";

const paymentSchema = new Schema<IPayment>(
  {
    ride: { type: Schema.Types.ObjectId, required: true, ref: "Ride" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(ERideStatus) },
    transactionId: { type: String },
    invoiceUrl: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
