import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Customer } from "./entities/customer.entity";
import { CustomerResponse, Res, UpdateUser } from "../types";
import { DetailsCustomer } from "./entities/details-customer.entity";
import { Product } from "src/products/entities/product.entity";

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
    {
      city,
      country,
      email,
      firstName,
      lastName,
      photo,
      phoneNumber
    }: UpdateUser
  ): Promise<Res> {
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

    if (firstName === "") {
      firstName = customer.firstName;
    }

    if (lastName === "") {
      firstName = customer.lastName;
    }

    if (email === "") {
      firstName = customer.email;
    }

    if (!email.includes("@")) {
      return {
        status: false,
        message: "Check your email address."
      };
    }

    if (photo === "") {
      firstName = customer.photos;
    }

    if (country === "") {
      firstName = detailsCustomer.country;
    }

    if (city === "") {
      firstName = detailsCustomer.city;
    }

    if (phoneNumber <= 0) {
      phoneNumber = detailsCustomer.phoneNumber;
    }

    if (phoneNumber.toString().length > 9) {
      return {
        status: false,
        message: `Phone number must have 9 number digits. Got ${phoneNumber}`
      };
    }

    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.email = email;
    customer.photos = photo;
    detailsCustomer.country = country;
    detailsCustomer.city = city;
    detailsCustomer.phoneNumber = phoneNumber;

    await customer.save();
    await detailsCustomer.save();

    return {
      status: true
    };
  }

  async addToFavorite(productId: string, person: any) {
    const pro = await Product.findOne({
      where: { id: productId },
      relations: ["fav"]
    });
    pro.fav = person;
    await pro.save();

    return {
      message: "Added"
    };
  }

  async listOfFavorites(person: any) {
    return await Product.find({ relations: ["fav"], where: { fav: person } });
  }

  async removeProduct(productId: string) {
    const pro = await Product.findOne({
      where: { id: productId },
      relations: ["fav"]
    });
    pro.fav = null;
    await pro.save();

    return {
      message: "Removed"
    };
  }
}
