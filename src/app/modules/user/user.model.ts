import { model, Schema } from "mongoose";
import { ERole, IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: {
        values: Object.values(ERole),
        message: "{VALUE} is not a valid role",
      },
      default: ERole.rider,
    },
    avatar: { type: String },
    driverProfile: { type: Schema.Types.ObjectId, ref: "Driver" },
    isVerified: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
