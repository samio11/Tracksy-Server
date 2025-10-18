import config from "../config";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserToken = (payload: Partial<IUser>) => {
  const userData = {
    id: payload._id,
    email: payload.email,
    role: payload.role,
  };
  const accessToken = generateToken(
    userData,
    config.JWT_ACCESS_TOKEN as string,
    config.JWT_ACCESS_EXPIRES as string
  );
  const refreshToken = generateToken(
    userData,
    config.JWT_REFRESH_TOKEN as string,
    config.JWT_REFRESH_EXPIRES as string
  );
  return {
    accessToken,
    refreshToken,
  };
};
