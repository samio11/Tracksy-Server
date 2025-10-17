import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization || req?.cookies?.accessToken;
      if (!token) {
        throw new AppError(401, "User Token Not Found");
      }

      const verifyUserToken = verifyToken(
        token,
        config.JWT_ACCESS_TOKEN as string
      ) as JwtPayload;
      const existUser = await User.findOne({ email: verifyUserToken?.email });
      if (!existUser) {
        throw new AppError(401, "User is not found");
      }
      if (existUser.isVerified === false) {
        throw new AppError(401, "User is not verified");
      }
      if (!roles.includes(existUser.role)) {
        throw new AppError(401, "Access Denied");
      }
      req.user = verifyUserToken;
      next();
    } catch (err) {
      next(err);
    }
  };
