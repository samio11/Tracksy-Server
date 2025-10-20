import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { paymentController } from "./payment.controller";
import { ERole } from "../user/user.interface";

const routes = Router();

routes.post("/success", paymentController.successfulPayment);
routes.post("/fail", paymentController.failPayment);
routes.post("/cancel", paymentController.canceledPayment);

routes.get(
  "/get-admin",
  checkAuth([ERole.admin]),
  paymentController.getAllPaymentData
);

export const paymentRoutes = routes;
