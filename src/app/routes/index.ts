import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";

export const rootRouter = Router();

const excludingRouter = [
  {
    path: "/auth",
    element: authRoutes,
  },
];

excludingRouter.forEach((x) => rootRouter.use(x.path, x.element));
