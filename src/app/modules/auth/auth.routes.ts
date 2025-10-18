import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { authController } from "./auth.controller";
import passport from "passport";
import config from "../../config";

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
router.post("/logout", authController.logout);

// Google Login

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req?.query?.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureMessage: `${config.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.googleLogin
);

export const authRoutes = router;
