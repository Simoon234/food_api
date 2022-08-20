import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
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

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.basketService.remove(+id);
  // }

  @Get("checkout-payment/:id")
  test(@Res() res: any, @Param("id") id: string) {
    return this.basketService.checkout(res, id);
  }
}
