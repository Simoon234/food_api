import { Inject, Injectable } from "@nestjs/common";
import { Customer } from "../customers/entities/customer.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./strategies/json-auth-strategy";
import { Response } from "express";
import { Role } from "src/types";

@Injectable()
export class AuthService {
  constructor(@Inject(JwtService) private jwtService: JwtService) {
  }

  async loggedIn(obj, res): Promise<any> {
    const getUser = await Customer.findOne({ where: { email: obj.email } });

    try {
      let customer = null;
      if (getUser === null) {
        const user = new Customer();
        user.id = obj.id;
        user.firstName = obj.firstName;
        user.lastName = obj.lastName;
        user.email = obj.email;
        user.photos = obj.picture;

        const { accessToken } = await this.login({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: Role.CUSTOMER
        });

        user.accessToken = accessToken;
        await user.save();

        customer = {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
          lastName: user.lastName,
          picture: user.photos
        };

        res
          .cookie("jwt", customer?.accessToken, {
            secure: false,
            domain: "localhost",
            httpOnly: true
          })
          .json({
            status: true,
            customer
          });
      }

      if (getUser.accessToken === null || getUser.accessToken === "") {
        const { accessToken } = await this.login({
          firstName: getUser.firstName,
          lastName: getUser.lastName,
          email: getUser.email
        });
        getUser.accessToken = accessToken;
        await getUser.save();

        res.json({
          message: "Logged in"
        });
      } else {
        res.json({
          status: false,
          message: "You are logged in"
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  async login(user) {
    const payload: JwtPayload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async logout(person, res: Response) {
    try {
      const customer = await Customer.findOne({
        where: { email: person.email, firstName: person.firstName }
      });
      customer.accessToken = null;
      await customer.save();
      res
        .clearCookie("jwt", {
          secure: false,
          domain: "localhost",
          httpOnly: true
        })
        .json({
          status: true,
          message: "Successfully logout"
        });
    } catch (e) {
      res.json({
        success: false,
        message: e.message
      });
    }
  }
}
