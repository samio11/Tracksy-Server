import { redisClient } from "../../config/redis.config";
import { AppError } from "../../errors/AppError";
import { calculateRideDetails } from "../../utils/calculateKmDistanceDuration";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";

export const createRide = async (payload: IRide) => {
  const { distance, duration, fare } = calculateRideDetails(
    payload.startRide,
    payload.endRide
  );

  let discountedPrice;
  // 15% discount on promocode
  if (payload.promoCode) {
    //! validate OTP
    const existUser = await User.findOne({ _id: payload.rider });
    if (!existUser) {
      throw new AppError(401, "User not found");
    }
    const otp_name = `discout_user_${existUser.email}`;
    console.log(otp_name);
    const stored_otp = await redisClient.get(otp_name);
    if (!stored_otp) {
      throw new AppError(401, "Discount OTP is Invalid now.");
    }
    if (stored_otp !== payload.promoCode) {
      throw new AppError(401, "OTP is not matched");
    }
    //!
    const p1 = Number(fare) * (1 - 0.15);
    discountedPrice = p1;
  }
  const modifiedPayload: Partial<IRide> = {
    rider: payload.rider,
    startRide: payload.startRide,
    endRide: payload.endRide,
    distance,
    duration,
    fare: discountedPrice || fare,
    promoCode: payload.promoCode || "",
  };

  const result = await Ride.create(modifiedPayload);
  return result;
};

const adminSendDiscountOTP = async (email: string) => {
  const otp = Math.floor(Math.random() * 999999) + 100000;
  const otp_name = `discout_user_${email}`;
  console.log(otp_name, otp);
  await redisClient.set(otp_name, otp, {
    expiration: {
      type: "EX",
      value: 3600,
    },
  });
  await sendEmail({
    to: email,
    subject: "Tracksy - Discount OTP 🔐",
    tempFileName: "discountOTP",
    tempFileData: {
      otp: otp,
      discount: 15,
    },
  });
};

export const rideServices = { createRide, adminSendDiscountOTP };
