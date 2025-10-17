import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import config from ".";
import { User } from "../modules/user/user.model";
import { ERole } from "../modules/user/user.interface";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: config.GOOGLE_CALLBACK_URL as string,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "User is not found" });
        }
        let existUser = await User.findOne({ email });
        if (!existUser) {
          existUser = await User.create({
            email,
            name: profile?.displayName,
            role: ERole.rider,
            avatar: profile?.photos?.[0].value,
            isVerified: true,
          });
        }

        if (existUser.isVerified === false) {
          return done(null, false, { message: "User is not verified" });
        }

        return done(null, existUser);
      } catch (err) {
        console.log("Google Login Error");
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
