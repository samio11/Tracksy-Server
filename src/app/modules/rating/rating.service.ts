import { AppError } from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Ride } from "../ride/ride.model";
import { ERole } from "../user/user.interface";
import { User } from "../user/user.model";
import { IRating } from "./rating.interface";
import { Rating } from "./rating.model";

const createRating = async (payload: IRating) => {
  const existRide = await Ride.findById(payload.ride);
  if (!existRide) {
    throw new AppError(401, "Ride is not available");
  }
  const existRider = await User.findById(payload.from);
  if (!existRider) {
    throw new AppError(401, "User not found");
  }
  if (existRider.role !== ERole.rider) {
    throw new AppError(401, "Not Valid Rider");
  }
  const existDriver = await User.findById(payload.to);
  if (!existDriver) {
    throw new AppError(401, "User not found");
  }
  if (existDriver.role !== ERole.driver) {
    throw new AppError(401, "Not Valid Driver");
  }
  const result = await Rating.create(payload);
  return result;
};

const getAllRating = async (query: Record<string, string>) => {
  const ratingQuery = new QueryBuilder(Rating.find(), query);
  const ratingData = ratingQuery
    .filter()
    .search(["score"])
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    ratingData.build().populate("from").populate("to"),
    ratingData.getMetaData(),
  ]);
  return { data, meta };
};

const getUserRating = async (riderId: string) => {
  const existRide = await Rating.find({ from: riderId });
  if (!existRide) {
    throw new AppError(401, "Riders Ride is not available");
  }
  return existRide;
};

export const ratingServices = { createRating, getAllRating, getUserRating };
