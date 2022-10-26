import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketReturnValue } from "../types";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { Person } from "../decorators/person.decorator";

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
  @Get("/get-all")
  findAll(@Person() person: any) {
    return this.basketService.getBasket(person);
  }

  @UseGuards(JwtGuard)
  @Get("total-price/:id")
  findOne(@Param("id") id: string) {
    return this.basketService.getTotalBasketPrice(id);
  }

  @UseGuards(JwtGuard)
  @Delete("/delete-product/:basketId/")
  remove(@Person() person: any, @Param("basketId") basketId: string) {
    return this.basketService.removeProductFromBasket(person, basketId);
  }

  @UseGuards(JwtGuard)
  @Get("checkout-payment/:id")
  checkout(@Res() res: any, @Person() person: any) {
    return this.basketService.checkout(res, person);
  }

  @UseGuards(JwtGuard)
  @Get("/clear-basket/:userId")
  clearBasket(@Param("userId") userId: string) {
    return this.basketService.clearBasket(userId);
  }

  @UseGuards(JwtGuard)
  @Get("/increaseQuantity/:id")
  increaseQuantity(@Person() user: any, @Param("id") id: string) {
    return this.basketService.increaseQuantity(user, id);
  }

  @UseGuards(JwtGuard)
  @Get("/decreaseQuantity/:id")
  decreaseQuantity(@Person() user: any, @Param("id") id: string) {
    return this.basketService.decreaseQuantity(user, id);
  }
}
