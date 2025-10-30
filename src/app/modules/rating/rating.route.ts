import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import { ratingController } from "./rating.controller";

const router = Router();

router.post("/create", checkAuth([ERole.rider]), ratingController.createRating);
router.get("/get-all", checkAuth([ERole.admin]), ratingController.getAllRating);
router.get("/get", checkAuth([ERole.rider]), ratingController.getAllRating);

export const ratingRoutes = router;
