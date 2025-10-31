import { model, Schema } from "mongoose";
import { ERole, IUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

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
    isVerified: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(
      this.password as string,
      Number(config.BCRYPT_SALT)
    );
    next();
  }
});

userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

export const User = model<IUser>("User", userSchema);
