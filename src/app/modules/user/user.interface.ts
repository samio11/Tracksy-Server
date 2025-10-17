import { Types } from "mongoose";

export enum ERole {
  rider = "Rider",
  driver = "Driver",
  admin = "Admin",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: ERole;
  avatar?: string;
  driverProfile?: Types.ObjectId;
  isVerified: boolean;
}
