import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { rideRoutes } from "../modules/ride/ride.routes";
import { userRoutes } from "../modules/user/user.routes";

import { paymentRoutes } from "../modules/payment/payment.routes";
import { ratingRoutes } from "../modules/rating/rating.route";

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
  {
    path: "/rating",
    element: ratingRoutes,
  },
  {
    path: "/payment",
    element: paymentRoutes,
  },
];

excludingRouter.forEach((x) => rootRouter.use(x.path, x.element));
