import { AppError } from "../../errors/AppError";
import { Driver } from "../driver/driver.model";
import { IVehicle } from "../vehicle/vehicle.interface";
import { Vehicle } from "../vehicle/vehicle.model";
import { ERole, IUser } from "./user.interface";
import { User } from "./user.model";

const adminChangeUserVerification = async (userId: string, status: boolean) => {
  const existUser = await User.findById(userId);
  if (!existUser) {
    throw new AppError(401, "Invalid User");
  }
  const updateUserStatus = await User.findByIdAndUpdate(
    userId,
    { isVerified: status },
    { new: true }
  );
  return updateUserStatus;
};

const adminDeleteUser = async (userId: string) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const existUser = await User.findById(userId);
    if (!existUser) {
      throw new AppError(401, "User is not exists");
    }
    if (existUser.role === ERole.driver) {
      const existDriver = await Driver.findById(existUser.driverProfile);
      const existVehicle = await Vehicle.findById(existDriver?._id);
      await Vehicle.findByIdAndDelete(existVehicle?._id);
      await Driver.findByIdAndDelete(existDriver?._id);
      await User.findByIdAndDelete(existUser?._id);
      return "";
    }
    const result = await User.findByIdAndDelete(userId);

    await session.commitTransaction();
    session.endSession();
    return "";
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// Delete Driver Car Info
const deleteDriverVehicle = async (payload: string) => {
  const result = await Vehicle.findByIdAndDelete(payload, { new: true });
  return "";
};
const createDriverVehicle = async (payload: IVehicle) => {
  const result = await Vehicle.create(payload);
  return result;
};

export const userServices = {
  adminChangeUserVerification,
  adminDeleteUser,
  deleteDriverVehicle,
  createDriverVehicle,
};
