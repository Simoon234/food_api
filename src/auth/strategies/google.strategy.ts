import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { clientID, clientSecret } from "../../../db-config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID,
      clientSecret,
      callbackURL: "http://localhost:3001/google/redirect",
      scope: ["email", "profile"]
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { name, emails, photos } = profile;

    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
      picture: photos[0].value,
    };

    if (user) {
      done(null, { ...user, accessToken });
    }
    return done(null);
  }
}
