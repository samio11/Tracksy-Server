import { model, Schema, SchemaType } from "mongoose";
import { IRating } from "./rating.interface";

export const ratingSchema = new Schema<IRating>(
  {
    ride: { type: Schema.Types.ObjectId, required: true, ref: "Ride" },
    from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    to: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    score: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const Rating = model<IRating>("Rating", ratingSchema);
