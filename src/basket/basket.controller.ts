import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketReturnValue } from "../types";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Person } from "../decorators/person.decorator";
import { Customer } from "src/customers/entities/customer.entity";

@Controller("basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {
  }

  @UseGuards(JwtGuard)
  @Post("/add/:userId/:productId")
  addProductToBasket(
    @Param("userId") userId: string,
    @Param("productId") productId: string,
    @Body() { quantity }: { quantity: number }
  ): Promise<BasketReturnValue> {
    return this.basketService.addToBasket(userId, productId, quantity);
  }

  @UseGuards(JwtGuard)
  @Get("/get-all/:id")
  findAll(@Person() person: Customer) {
    return this.basketService.getBasket(person);
  }

  @UseGuards(JwtGuard)
  @Get("total-price/:id")
  findOne(@Param("id") id: string) {
    return this.basketService.getTotalBasketPrice(id);
  }

  @UseGuards(JwtGuard)
  @Delete("/delete-product/:basketId/:userId")
  remove(@Param("userId") userId: string, @Param("basketId") basketId: string) {
    return this.basketService.removeProductFromBasket(userId, basketId);
  }

  @UseGuards(JwtGuard)
  @Get("checkout-payment/:id")
  checkout(@Res() res: any, @Param("id") id: string) {
    return this.basketService.checkout(res, id);
  }

  @UseGuards(JwtGuard)
  @Get("/clear-basket/:userId")
  clearBasket(@Param("userId") userId: string) {
    return this.basketService.clearBasket(userId);
  }
}
