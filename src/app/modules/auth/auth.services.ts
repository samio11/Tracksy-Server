import config from "../../config";
import { redisClient } from "../../config/redis.config";
import { AppError } from "../../errors/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { IDriver } from "../driver/driver.interface";
import { Driver } from "../driver/driver.model";
import { ERole, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { IVehicle } from "../vehicle/vehicle.interface";
import { Vehicle } from "../vehicle/vehicle.model";
import bcrypt from "bcrypt";

const registerAsUser = async (payload: IUser) => {
  const result = await User.create(payload);
  await sendEmail({
    to: result.email,
    subject: "Welcome to Tracksy 🚗 - Verify Your Account",
    tempFileName: "welcome",
    tempFileData: {
      name: result.name,
      email: result.email,
      profilePic: result.avatar,
      verifyLink: `https://tracksy-server.onrender.com/api/v1/auth/verify/${payload.email}`,
      logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
    },
  });
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

    await sendEmail({
      to: updateUserDriverProfile?.email as string,
      subject: "Welcome to Tracksy 🚗 - Verify Your Account",
      tempFileName: "welcome",
      tempFileData: {
        name: updateUserDriverProfile?.name,
        email: updateUserDriverProfile?.email,
        profilePic: updateUserDriverProfile?.avatar,
        verifyLink: `https://tracksy-server.onrender.com/api/v1/auth/verify/${updateUserDriverProfile?.email}`,
        logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
      },
    });
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

const registerAdmin = async (payload: IUser) => {
  const updatedPayload = { ...payload, role: ERole.admin };
  //   https://i.ibb.co/XZwMnkH1/tracksy.jpg
  const result = await User.create(updatedPayload);

  await sendEmail({
    to: result.email,
    subject: "Welcome to Tracksy 🚗 - Verify Your Account",
    tempFileName: "welcome",
    tempFileData: {
      name: result.name,
      email: result.email,
      profilePic: result.avatar,
      verifyLink: `https://tracksy-server.onrender.com/api/v1/auth/verify/${payload.email}`,
      logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
    },
  });

  return result;
};

const login = async (payload: { email: string; password: string }) => {
  const existUser = await User.findOne({ email: payload.email });
  if (!existUser) {
    throw new AppError(401, "User is not exists");
  }
  const passMatch = await bcrypt.compare(
    payload.password,
    existUser.password as string
  );
  if (!passMatch) {
    throw new AppError(401, "Invalid Password");
  }
  if (existUser.isVerified === false) {
    throw new AppError(401, "Please Verify...");
  }
  return existUser;
};

const verifyUser = async (payload: string) => {
  const existUser = await User.findOne({ email: payload });
  if (!existUser) {
    throw new AppError(401, "User is not exists");
  }
  const result = await User.findOneAndUpdate(
    { email: existUser.email },
    { isVerified: true },
    { new: true }
  );
  return result;
};

const sendForgetPassOTP = async (email: string) => {
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new AppError(401, "User is not available");
  }
  if (existUser.isVerified === false) {
    throw new AppError(401, "Please Verify First");
  }

  const otp = Math.floor(Math.random() * 999999) + 100000;
  const otp_name = `otp_${existUser.email}`;
  await redisClient.set(otp_name, otp, {
    expiration: {
      type: "EX",
      value: 120,
    },
  });
  await sendEmail({
    to: existUser.email,
    subject: "Tracksy - Password Reset OTP 🔐",
    tempFileName: "forgotPasswordOTP",
    tempFileData: {
      email: existUser.email,
      otp: otp,
      logo: "https://i.ibb.co/XZwMnkH1/tracksy.jpg",
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new AppError(401, "User is not available");
  }
  const otp_name = `otp_${existUser.email}`;
  const stored_otp = await redisClient.get(otp_name);
  if (!stored_otp) {
    throw new AppError(
      401,
      "OTP is Invalid now. Please resend otp again or check otp again"
    );
  }
  if (stored_otp !== otp) {
    throw new AppError(401, "OTP is not matched");
  }
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.BCRYPT_SALT)
  );
  const result = await User.findOneAndUpdate(
    { email: existUser.email },
    { password: hashPassword, isVerified: true },
    { new: true }
  );
  return result;
};

export const authServices = {
  registerAsDriver,
  registerAsUser,
  registerAdmin,
  login,
  verifyUser,
  sendForgetPassOTP,
  resetPassword,
};
