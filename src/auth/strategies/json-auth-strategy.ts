import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
import { SECRET_JWT_KEY } from "../../../db-config";

dotenv.config();

function cookieExtract(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

export type JwtPayload = {
  firstName: string;
  lastName: string;
  email: string;
};

@Injectable()
export class JsonAuthStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: cookieExtract,
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT_KEY
    });
  }

  async validate({ email, firstName, lastName }: JwtPayload) {
    return { email, firstName, lastName };
  }
}
