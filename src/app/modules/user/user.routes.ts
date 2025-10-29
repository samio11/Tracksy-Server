import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "./user.interface";
import { userControllers } from "./user.controller";

const router = Router();

router.post(
  "/driver/create/vehicle",
  checkAuth([ERole.admin, ERole.driver]),
  userControllers.createDriverVehicle
);

router.patch(
  "/change-verification",
  checkAuth([ERole.admin]),
  userControllers.adminChangeUserVerification
);

router.delete(
  "/delete/:userId",
  checkAuth([ERole.admin]),
  userControllers.adminDeleteUser
);
router.delete(
  "/driver/delete/vehicle/:id",
  checkAuth([ERole.admin, ERole.driver]),
  userControllers.deleteDriverVehicle
);

router.patch(
  "/update/:id",
  checkAuth(Object.values(ERole)),
  userControllers.updateAUser
);

router.get("/get", checkAuth([ERole.admin]), userControllers.getAllUser);
router.get(
  "/get/:id",
  checkAuth(Object.values(ERole)),
  userControllers.getAUser
);

export const userRoutes = router;
