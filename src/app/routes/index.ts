import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { rideRoutes } from "../modules/ride/ride.routes";
import { userRoutes } from "../modules/user/user.routes";

export const rootRouter = Router();

const excludingRouter = [
  {
    path: "/auth",
    element: authRoutes,
  },
  {
    path: "/ride",
    element: rideRoutes,
  },
  {
    path: "/user",
    element: userRoutes,
  },
];

excludingRouter.forEach((x) => rootRouter.use(x.path, x.element));
