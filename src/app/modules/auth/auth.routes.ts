import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.login);

router.post(
  "/register-rider",
  multerUpload.single("file"),
  authController.registerUser
);
router.post(
  "/register-admin",
  multerUpload.single("file"),
  authController.registerAdmin
);
router.post(
  "/register-driver",
  multerUpload.array("files"),
  authController.registerDriver
);

router.get("/verify/:email", authController.verifyUser);
router.post("/send-otp", authController.sendForgetPassOTP);
router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
