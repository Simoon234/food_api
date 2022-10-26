import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { Customer } from "../../customers/entities/customer.entity";
import { token } from "../common/createToken";
import { generateToken } from "../common/generateToken";

@Injectable()
export class GoogleService {
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

        const accessToken = token(
          await generateToken(user),
          user.id,
          user.email
        );


        await user.save();

        customer = {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
          lastName: user.lastName,
          picture: user.photos
        };

        res
          .cookie("jwt", accessToken.accessToken, {
            secure: false,
            domain: "localhost",
            httpOnly: true
          })
          .json({
            status: true,
            customer
          });
      }

      if (getUser.accessToken === null) {
        token(await generateToken(getUser), getUser.id, getUser.email);
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

  async logout(person, res: Response) {
    try {
      const customer = await Customer.findOne({
        where: { email: person.email, id: person.id }
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
