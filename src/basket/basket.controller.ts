import { Body, Controller, Delete, Get, Param, Post, Res } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketReturnValue } from "../types";

@Controller("basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {
  }

  @Post("/add/:userId/:productId")
  addProductToBasket(
    @Param("userId") userId: string,
    @Param("productId") productId: string,
    @Body() { quantity }: { quantity: number }
  ): Promise<BasketReturnValue> {
    return this.basketService.addToBasket(userId, productId, quantity);
  }

  @Get("/get-all/:id")
  findAll(@Param("id") id: string) {
    return this.basketService.getBasket(id);
  }

  @Get("total-price/:id")
  findOne(@Param("id") id: string) {
    return this.basketService.getTotalBasketPrice(id);
  }

  @Delete("/delete-product/:basketId/:userId")
  remove(@Param("userId") userId: string, @Param("basketId") basketId: string) {
    return this.basketService.removeProductFromBasket(userId, basketId);
  }

  @Get("checkout-payment/:id")
  checkout(@Res() res: any, @Param("id") id: string) {
    return this.basketService.checkout(res, id);
  }

  @Get("/clear-basket/:userId")
  clearBasket(@Param("userId") userId: string) {
    return this.basketService.clearBasket(userId);
  }
}
