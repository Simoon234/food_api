import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Customer } from "./entities/customer.entity";
import { CustomerResponse, Res, UpdateUser } from "../types";
import { DetailsCustomer } from "./entities/details-customer.entity";

@Injectable()
export class CustomersService {
  async findOne(id: string): Promise<CustomerResponse> {
    const customer = await Customer.findOne({
      where: { id },
      relations: ["details"]
    });

    return {
      status: customer !== null,
      customer: customer ?? "No user found."
    };
  }

  //finish type
  async updateCustomer(
    id: string,
    { city, country, email, firstName, lastName }: UpdateUser
  ): Promise<Res> {
    let user;
    const customer = await Customer.findOne({
      where: { id },
      relations: ["details"]
    });

    if (!customer) {
      throw new HttpException("No customer found", HttpStatus.BAD_REQUEST);
    }

    const detailsCustomer = await DetailsCustomer.findOne({
      where: { id: customer.details.id }
    });

    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.email = email;
    detailsCustomer.country = country;
    detailsCustomer.city = city;

    //to verify...
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      country === "" ||
      city === ""
    ) {
      return;
    }

    await customer.save();
    await detailsCustomer.save();

    return {
      status: true
    };
  }
}
