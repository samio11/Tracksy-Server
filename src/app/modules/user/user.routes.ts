import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "./user.interface";
import { userControllers } from "./user.controller";

const router = Router();

router.patch(
  "/change-verification",
  checkAuth([ERole.admin]),
  userControllers.adminChangeUserVerification
);

router.delete(
  "/delete",
  checkAuth([ERole.admin]),
  userControllers.adminDeleteUser
);

export const userRoutes = router;
