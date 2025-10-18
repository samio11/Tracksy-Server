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
//! Driver
router.post(
  "/accept-ride",
  checkAuth([ERole.driver]),
  rideController.acceptRideByDriver
);
router.post(
  "/start-ride",
  checkAuth([ERole.driver]),
  rideController.startRideByDriver
);
router.post(
  "/complete-ride",
  checkAuth([ERole.driver]),
  rideController.completeRideByDriver
);
//! Rider
router.post(
  "/cancel-ride",
  checkAuth([ERole.rider]),
  rideController.cancelRideByRider
);

router.get("/get-all", rideController.findAllRidesData);

export const rideRoutes = router;
