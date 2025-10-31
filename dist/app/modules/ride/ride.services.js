"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideServices = exports.createRide = void 0;
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = require("../../errors/AppError");
const calculateKmDistanceDuration_1 = require("../../utils/calculateKmDistanceDuration");
const getTransectionId_1 = require("../../utils/getTransectionId");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const sendEmail_1 = require("../../utils/sendEmail");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const createRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { distance, duration, fare } = (0, calculateKmDistanceDuration_1.calculateRideDetails)(payload.startRide, payload.endRide);
    let discountedPrice;
    // 15% discount on promocode
    if (payload.promoCode) {
        //! validate OTP
        const existUser = yield user_model_1.User.findOne({ _id: payload.rider });
        if (!existUser) {
            throw new AppError_1.AppError(401, "User not found");
        }
        const otp_name = `discout_user_${existUser.email}`;
        // console.log(otp_name);
        const stored_otp = yield redis_config_1.redisClient.get(otp_name);
        if (!stored_otp) {
            throw new AppError_1.AppError(401, "Discount OTP is Invalid now.");
        }
        if (stored_otp !== payload.promoCode) {
            throw new AppError_1.AppError(401, "OTP is not matched");
        }
        //!
        const p1 = Number(fare) * (1 - 0.15);
        discountedPrice = p1;
    }
    const modifiedPayload = {
        rider: payload.rider,
        startRide: payload.startRide,
        endRide: payload.endRide,
        distance,
        duration,
        fare: discountedPrice || fare,
        promoCode: payload.promoCode || "",
    };
    const result = yield ride_model_1.Ride.create(modifiedPayload);
    return result;
});
exports.createRide = createRide;
const adminSendDiscountOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = Math.floor(Math.random() * 999999) + 100000;
    const otp_name = `discout_user_${email}`;
    // console.log(otp_name, otp);
    yield redis_config_1.redisClient.set(otp_name, otp, {
        expiration: {
            type: "EX",
            value: 3600,
        },
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Tracksy - Discount OTP 🔐",
        tempFileName: "discountOTP",
        tempFileData: {
            otp: otp,
            discount: 15,
        },
    });
});
// Driver
const acceptRideByDriver = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const existRide = yield ride_model_1.Ride.findById(rideId);
        if (!existRide) {
            throw new AppError_1.AppError(401, "Ride is not exists");
        }
        if (existRide.rideStatus !== ride_interface_1.ERideStatus.requested) {
            throw new AppError_1.AppError(401, "You Cant accept this ride now");
        }
        const updateRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
            rideStatus: ride_interface_1.ERideStatus.accepted,
            driver: driverId,
            rideHistory: [
                ...existRide.rideHistory,
                { status: ride_interface_1.ERideStatus.accepted, time: new Date() },
            ],
        }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return updateRide;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const startRideByDriver = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const existRide = yield ride_model_1.Ride.findById(rideId);
        if (!existRide) {
            throw new AppError_1.AppError(401, "Ride is not exists");
        }
        if (((_a = existRide.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
            throw new AppError_1.AppError(401, "This Driver is not for this ride");
        }
        if (!existRide.rideHistory.find((x) => x.status === ride_interface_1.ERideStatus.accepted)) {
            throw new AppError_1.AppError(401, "You Cant start this ride now");
        }
        const updateRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
            rideStatus: ride_interface_1.ERideStatus.started,
            rideHistory: [
                ...existRide.rideHistory,
                { status: ride_interface_1.ERideStatus.started, time: new Date() },
            ],
        }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return updateRide;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const completeRideByDriver = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const existRide = yield ride_model_1.Ride.findById(rideId);
        if (!existRide) {
            throw new AppError_1.AppError(401, "Ride is not exists");
        }
        if (((_b = existRide.driver) === null || _b === void 0 ? void 0 : _b.toString()) !== driverId) {
            throw new AppError_1.AppError(401, "This Driver is not for this ride");
        }
        if (!existRide.rideHistory.find((x) => x.status === ride_interface_1.ERideStatus.started)) {
            throw new AppError_1.AppError(401, "You Cant end this ride now");
        }
        const userInfoOfRide = yield user_model_1.User.findById(existRide.rider);
        if (!userInfoOfRide) {
            throw new AppError_1.AppError(401, "Rider not found");
        }
        const updateRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
            rideStatus: ride_interface_1.ERideStatus.completed,
            rideHistory: [
                ...existRide.rideHistory,
                { status: ride_interface_1.ERideStatus.completed, time: new Date() },
            ],
        }, { new: true, session });
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
        const tran_id = (0, getTransectionId_1.getTransectionId)();
        const sslCommerzPayload = {
            name: userInfoOfRide.name,
            email: userInfoOfRide.email,
            phoneNumber: userInfoOfRide.phone,
            transactionId: tran_id,
            amount: Number(existRide.fare),
        };
        console.log(sslCommerzPayload);
        const sslCommerz = yield sslCommerz_services_1.SSLService.sslPaymentInit(sslCommerzPayload);
        console.log(sslCommerz);
        const invoice_url = sslCommerz.GatewayPageURL;
        const newPayment = yield payment_model_1.Payment.create([
            {
                ride: existRide._id,
                user: userInfoOfRide._id,
                amount: Number(existRide.fare),
                status: payment_interface_1.EPaymentStatus.pending,
                transactionId: tran_id,
                invoiceUrl: invoice_url,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            payment_url: invoice_url,
            payment_data: newPayment,
        };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
//! User
const cancelRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const existRide = yield ride_model_1.Ride.findById(rideId);
    if (!existRide) {
        throw new AppError_1.AppError(401, "Ride is not exists");
    }
    if (existRide.rider.toString() !== riderId) {
        throw new AppError_1.AppError(401, "This Ride is not made by you");
    }
    if (existRide.rideStatus !== ride_interface_1.ERideStatus.requested) {
        throw new AppError_1.AppError(401, "You Cant cancel this ride now");
    }
    const updateRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
        rideStatus: ride_interface_1.ERideStatus.cancelled,
        rideHistory: [
            ...existRide.rideHistory,
            { status: ride_interface_1.ERideStatus.cancelled, time: new Date() },
        ],
    }, { new: true });
    return updateRide;
});
const findAllRidesData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const rideQuery = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const rideData = yield rideQuery
        .filter()
        .search(["rideStatus"])
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        rideData.build().populate("rider"),
        rideQuery.getMetaData(),
    ]);
    return {
        data,
        meta,
    };
});
const singleRideData = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_model_1.Ride.findById(rideId);
    return result;
});
const riderGetHisRideDetails = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_model_1.Ride.find({ rider: riderId }).populate("rider");
    return result;
});
exports.rideServices = {
    createRide: exports.createRide,
    adminSendDiscountOTP,
    acceptRideByDriver,
    startRideByDriver,
    completeRideByDriver,
    cancelRide,
    findAllRidesData,
    singleRideData,
    riderGetHisRideDetails,
};
