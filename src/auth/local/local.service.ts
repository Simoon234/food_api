import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Customer } from "src/customers/entities/customer.entity";
import { PersonInterface, Role, User } from "../../types";
import { hashPassword, verifyPassword } from "../../utils/hashPassword";
import { LogDto } from "./dto/log.dto";
import { Response } from "express";
import { logout } from "../common/logout";
import { DetailsCustomer } from "src/customers/entities/details-customer.entity";
import { token } from "../common/createToken";
import { generateToken } from "../common/generateToken";

@Injectable()
export class LocalService {
  async register(customer: User) {
    const password = await hashPassword(customer.password);
    const photo =
      "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
    const checkEmail = await Customer.findOne({
      where: { email: customer.email }
    });

    if (checkEmail !== null)
      throw new HttpException(
        "User already registered with that email.",
        HttpStatus.BAD_REQUEST
      );

    const newCustomer = new Customer();
    newCustomer.firstName = customer.firstName;
    newCustomer.lastName = customer.lastName;
    newCustomer.email = customer.email;
    newCustomer.password = password;
    newCustomer.photos = photo;

    const details = new DetailsCustomer();
    await details.save();

    newCustomer.details = details;

    await newCustomer.save();

    return {
      success: true
    };
  }

  async login(req: LogDto, res: Response) {
    const { email, password } = req;

    try {
      const findUser = await Customer.findOne({ where: { email } });

      if (!findUser)
        throw new HttpException("No user with email", HttpStatus.BAD_REQUEST);

      const comparePwd = await verifyPassword(password, findUser.password);

      if (!comparePwd)
        throw new HttpException("Password do not match", HttpStatus.CONFLICT);

      const { accessToken } = token(
        await generateToken(findUser),
        findUser.id,
        findUser.email
      );

      res
        .cookie("jwt", accessToken, {
          secure: false,
          domain: "localhost",
          httpOnly: true
        })
        .json({
          success: true,
          findUser
        });
    } catch (err) {
      res.json({ err });
    }
  }

  async logout(person: PersonInterface, res: Response) {
    return logout(person, res);
  }

  async checkAuthentication(person: any) {
    let user;
    let resUser;
    if (person.role === Role.customer) {
      user = await Customer.findOne({ where: { id: person.id } });
      resUser = {
        ...user
      };
    }

    if (person.role === Role.admin) {
      user = await Customer.findOne({ where: { id: person.id } });
      resUser = {
        ...user
      };
    }

    return {
      success: true,
      role: person.role,
      id: person.id,
      user: resUser
    };
  }
}
