import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomerResponse, UpdateUser } from "../types";
import { Person } from "../decorators/person.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Controller("customer")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {
  }

  @Patch("/update-one/:id")
  update(@Param("id") id: string, @Body() updateCustomer: UpdateUser) {
    return this.customersService.updateCustomer(id, updateCustomer);
  }

  @Get("/details/:id")
  findOne(@Param("id") id: string): Promise<CustomerResponse> {
    return this.customersService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Get("/add-to-favorite/:productId")
  add(
    @Param("productId") productId: string,
    @Person() person: any
  ) {
    return this.customersService.addToFavorite(productId, person);
  }

  @UseGuards(JwtGuard)
  @Get("/remove-from-favorite/:productId")
  remove(
    @Param("productId") productId: string
  ) {
    return this.customersService.removeProduct(productId);
  }

  @UseGuards(JwtGuard)
  @Get("/all")
  all(@Person() person: any) {
    return this.customersService.listOfFavorites(person);
  }
}
