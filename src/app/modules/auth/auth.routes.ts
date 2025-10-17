import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/register-rider",
  multerUpload.single("file"),
  authController.registerUser
);
router.post(
  "/register-driver",
  multerUpload.array("files"),
  authController.registerDriver
);

export const authRoutes = router;
