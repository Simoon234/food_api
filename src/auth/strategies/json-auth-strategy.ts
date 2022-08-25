import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
import { SECRET_JWT_KEY } from "../../../db-config";
import { Role } from "src/types";
import { Customer } from "src/customers/entities/customer.entity";

dotenv.config();

function cookieExtract(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

export type JwtPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
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

  async validate(
    { email, firstName, lastName, id }: JwtPayload,
    done: (err, customers) => void
  ) {
    if (!email || !firstName || !lastName) {
      return done(new UnauthorizedException(), false);
    }
    const customers = await Customer.findOne({
      where: { email, firstName, lastName, id }
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
