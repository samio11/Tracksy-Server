import { AppError } from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Driver } from "../driver/driver.model";
import { Ride } from "../ride/ride.model";
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

const getAllUser = async (query: Record<string, string>) => {
  const userQuery = new QueryBuilder(User.find(), query);
  const userData = await userQuery
    .filter()
    .search(["email"])
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    userData.getMetaData(),
  ]);
  return { data, meta };
};

const getAUser = async (id: string) => {
  const result = await User.findById(id)?.populate("driverProfile");
  return result;
};

const updateUserData = async (id: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

interface IAdminStats {
  totalRides: number;
  totalIncome: number;
  totalUsers: number;
  totalDrivers: number;
  ridesByDay?: { date: string; rides: number }[];
}

export const getAdminStats = async (): Promise<IAdminStats> => {
  // Total rides and total income
  const rideStats = await Ride.aggregate([
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        totalIncome: { $sum: "$fare" },
      },
    },
  ]);

  // Total users
  const totalUsers = await User.countDocuments({ role: ERole.rider });
  const totalDrivers = await User.countDocuments({ role: ERole.driver });

  // Optional: Rides by day for chart
  const ridesByDay = await Ride.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        rides: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        rides: 1,
        _id: 0,
      },
    },
  ]);

  return {
    totalRides: rideStats[0]?.totalRides || 0,
    totalIncome: rideStats[0]?.totalIncome || 0,
    totalUsers,
    totalDrivers,
    ridesByDay,
  };
};

const getAUserRideCount = async (riderId: string) => {
  const existUser = await Ride.findOne({ rider: riderId });
  if (!existUser) {
    throw new AppError(401, "User is not Found");
  }
  const result = await Ride.countDocuments({ rider: riderId });
  return { rideCount: result };
};

export const userServices = {
  adminChangeUserVerification,
  adminDeleteUser,
  deleteDriverVehicle,
  createDriverVehicle,
  getAllUser,
  getAUser,
  updateUserData,
  getAdminStats,
  getAUserRideCount,
};
