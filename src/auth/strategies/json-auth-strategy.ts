import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
import { SECRET_JWT_KEY } from "../../../db-config";
import { Customer } from "../../customers/entities/customer.entity";

dotenv.config();

function cookieExtract(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}


@Injectable()
export class JsonAuthStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: cookieExtract,
      ignoreExpiration: false,
      secretOrKey: SECRET_JWT_KEY
    });
  }

  async validate(payload: any, done: (err, customers) => void) {
    const customers = await Customer.findOne({
      where: { accessToken: payload.id }
    });

    if (!customers) {
      return done(new UnauthorizedException(), false);
    }

    done(null, {
      id: customers.id,
      email: customers.email,
      firstName: customers.firstName,
      lastName: customers.lastName,
      role: customers.roles
    });
  }
}
