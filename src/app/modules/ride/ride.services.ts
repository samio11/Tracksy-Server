import { redisClient } from "../../config/redis.config";
import { AppError } from "../../errors/AppError";
import { calculateRideDetails } from "../../utils/calculateKmDistanceDuration";
import { getTransectionId } from "../../utils/getTransectionId";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { sendEmail } from "../../utils/sendEmail";
import { Driver } from "../driver/driver.model";
import { EPaymentStatus } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.services";
import { User } from "../user/user.model";
import { ERideStatus, IRide } from "./ride.interface";
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
    // console.log(otp_name);
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
  // console.log(otp_name, otp);
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
// Driver
const acceptRideByDriver = async (rideId: string, driverId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();
  try {
    const existRide = await Ride.findById(rideId);
    if (!existRide) {
      throw new AppError(401, "Ride is not exists");
    }
    if (existRide.rideStatus !== ERideStatus.requested) {
      throw new AppError(401, "You Cant accept this ride now");
    }

    const updateRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        rideStatus: ERideStatus.accepted,
        driver: driverId,
        rideHistory: [
          ...existRide.rideHistory,
          { status: ERideStatus.accepted, time: new Date() },
        ],
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updateRide;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const startRideByDriver = async (rideId: string, driverId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();
  try {
    const existRide = await Ride.findById(rideId);
    if (!existRide) {
      throw new AppError(401, "Ride is not exists");
    }
    if (existRide.driver?.toString() !== driverId) {
      throw new AppError(401, "This Driver is not for this ride");
    }

    if (!existRide.rideHistory.find((x) => x.status === ERideStatus.accepted)) {
      throw new AppError(401, "You Cant start this ride now");
    }

    const updateRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        rideStatus: ERideStatus.started,
        rideHistory: [
          ...existRide.rideHistory,
          { status: ERideStatus.started, time: new Date() },
        ],
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return updateRide;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const completeRideByDriver = async (rideId: string, driverId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();
  try {
    const existRide = await Ride.findById(rideId);
    if (!existRide) {
      throw new AppError(401, "Ride is not exists");
    }
    if (existRide.driver?.toString() !== driverId) {
      throw new AppError(401, "This Driver is not for this ride");
    }

    if (!existRide.rideHistory.find((x) => x.status === ERideStatus.started)) {
      throw new AppError(401, "You Cant end this ride now");
    }
    const userInfoOfRide = await User.findById(existRide.rider);
    if (!userInfoOfRide) {
      throw new AppError(401, "Rider not found");
    }

    const updateRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        rideStatus: ERideStatus.completed,
        rideHistory: [
          ...existRide.rideHistory,
          { status: ERideStatus.completed, time: new Date() },
        ],
      },
      { new: true, session }
    );

    // const extractDriverIdFromUser = await User.findById(driverId);
    // if (!extractDriverIdFromUser) {
    //   throw new AppError(401, "Please fill this form");
    // }
    // const driverInfo = await Driver.findOne({
    //   _id: extractDriverIdFromUser?.driverProfile,
    // });

    // const updateDriverIncome = await Driver.findByIdAndUpdate(
    //   driverInfo?._id,
    //   { $inc: { income: existRide.fare, acceptedRide: +1 } },
    //   { new: true, session }
    // );
    const tran_id = getTransectionId();

    const sslCommerzPayload: ISSLCommerz = {
      name: userInfoOfRide.name as string,
      email: userInfoOfRide.email as string,
      phoneNumber: userInfoOfRide.phone as string,
      transactionId: tran_id,
      amount: Number(existRide.fare),
    };
    console.log(sslCommerzPayload);
    const sslCommerz = await SSLService.sslPaymentInit(sslCommerzPayload);
    console.log(sslCommerz);
    const invoice_url = sslCommerz.GatewayPageURL;

    const newPayment = await Payment.create(
      [
        {
          ride: existRide._id,
          user: userInfoOfRide._id,
          amount: Number(existRide.fare),
          status: EPaymentStatus.pending,
          transactionId: tran_id,
          invoiceUrl: invoice_url,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      payment_url: invoice_url,
      payment_data: newPayment,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
//! User
const cancelRide = async (rideId: string, riderId: string) => {
  const existRide = await Ride.findById(rideId);
  if (!existRide) {
    throw new AppError(401, "Ride is not exists");
  }
  if (existRide.rider.toString() !== riderId) {
    throw new AppError(401, "This Ride is not made by you");
  }

  if (existRide.rideStatus !== ERideStatus.requested) {
    throw new AppError(401, "You Cant cancel this ride now");
  }

  const updateRide = await Ride.findByIdAndUpdate(
    rideId,
    {
      rideStatus: ERideStatus.cancelled,
      rideHistory: [
        ...existRide.rideHistory,
        { status: ERideStatus.cancelled, time: new Date() },
      ],
    },
    { new: true }
  );
  return updateRide;
};

const findAllRidesData = async (query: Record<string, string>) => {
  const rideQuery = new QueryBuilder(Ride.find(), query);
  const rideData = await rideQuery
    .filter()
    .search(["rideStatus"])
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    rideData.build().populate("rider"),
    rideQuery.getMetaData(),
  ]);
  return {
    data,
    meta,
  };
};

const singleRideData = async (rideId: string) => {
  const result = await Ride.findById(rideId);
  return result;
};

export const rideServices = {
  createRide,
  adminSendDiscountOTP,
  acceptRideByDriver,
  startRideByDriver,
  completeRideByDriver,
  cancelRide,
  findAllRidesData,
  singleRideData,
};
