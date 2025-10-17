import { IDriver } from "../driver/driver.interface";
import { Driver } from "../driver/driver.model";
import { ERole, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { IVehicle } from "../vehicle/vehicle.interface";
import { Vehicle } from "../vehicle/vehicle.model";

const registerAsUser = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

interface TDriverType extends IUser, IDriver, IVehicle {}

const registerAsDriver = async (payload: TDriverType) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const newUser = await User.create(
      [
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          password: payload.password,
          role: ERole.driver,
          avatar: payload.avatar,
          isVerified: true,
        },
      ],
      { session }
    );
    const newVehicle = await Vehicle.create(
      [
        {
          owner: newUser[0]?._id,
          model: payload.model,
          year: payload.year,
          maxCapacity: payload.maxCapacity,
          vehicleImage: payload.vehicleImage,
          type: payload.type,
        },
      ],
      { session }
    );
    const newDriver = await Driver.create([
      {
        user: newUser[0]?._id,
        vehicle: newVehicle[0]?._id,
        licenseNumber: payload.licenseNumber,
        status: payload.status,
        location: payload.location,
        rating: payload.rating,
        acceptedRide: payload.acceptedRide,
      },
    ]);

    const updateUserDriverProfile = await User.findByIdAndUpdate(
      newUser[0]?._id,
      { driverProfile: newDriver[0]?._id },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return updateUserDriverProfile;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log("Driver Registration Failed", err);
    throw err;
  }
};

export const authServices = { registerAsDriver, registerAsUser };
