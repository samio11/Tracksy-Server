import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { rideController } from "./ride.controller";

const router = Router();

router.post("/create", checkAuth([ERole.rider]), rideController.createRide);
router.post(
  "/discount",
  checkAuth([ERole.admin]),
  rideController.adminSendDiscountOTP
);

export const rideRoutes = router;
