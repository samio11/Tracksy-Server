import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ratingServices } from "./rating.service";

const createRating = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const result = await ratingServices.createRating(payload);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Rating creating Done",
    data: result,
  });
});

const getAllRating = catchAsync(async (req, res, next) => {
  const query = req?.query || "";
  const result = await ratingServices.getAllRating(
    query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    message: "Get all rating Data",
    statusCode: 200,
    data: result,
  });
});
const getRatingByUser = catchAsync(async (req, res, next) => {
  const { id } = req?.user as JwtPayload;
  const result = await ratingServices.getUserRating(id);
  sendResponse(res, {
    success: true,
    message: "Get all rating Data",
    statusCode: 200,
    data: result,
  });
});

export const ratingController = { createRating, getAllRating, getRatingByUser };
