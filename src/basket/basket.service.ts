import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BasketEntity } from "./entities/basket.entity";
import { BasketReturnValue, FindOneInterface } from "../types";
import { Product } from "../products/entities/product.entity";
import { Customer } from "src/customers/entities/customer.entity";

@Injectable()
export class BasketService {
  private static basketFilter(obj: BasketEntity) {
    return {
      id: obj.id,
      quantity: obj.quantity,
      product: {
        id: obj.productItems.id,
        productName: obj.productItems.productName,
        productCategory: obj.productItems.productCategory,
        productPrice: obj.productItems.productPrice,
        productImage: obj.productItems.productImage
      }
    };
  }

  async addToBasket(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<BasketReturnValue> {
    const productItem = await Product.findOne({ where: { id: productId } });

    const user = await Customer.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    if (!productItem)
      throw new HttpException(
        "Sorry, no product with id " + productId + " found",
        HttpStatus.NOT_FOUND
      );

    if (
      productItem.productQuantity <= 0 ||
      quantity > productItem.productQuantity
    ) {
      throw new HttpException(
        `Product quantity ${productItem.productQuantity}. You want to add ${quantity}`,
        HttpStatus.BAD_REQUEST
      );
    }

    const basket = new BasketEntity();
    basket.quantity = quantity;

    await basket.save();

    basket.user = user;
    basket.productItems = productItem;
    productItem.productQuantity -= quantity;

    await basket.save();
    await productItem.save();
    return {
      quantity,
      userId: user.id,
      productId: productItem.id,
      price: productItem.productPrice
    };
  }

  async getBasket(id: string) {
    const user = await Customer.findOne({ where: { id } });

    if (!user) {
      throw new HttpException("There is no user", HttpStatus.BAD_REQUEST);
    }
    const basket = await BasketEntity.find({
      where: {
        user: user as unknown as FindOneInterface
      },
      relations: ["productItems"]
    });

    const totalPrice = basket
      .map((item) => item.productItems.productPrice * item.quantity * 1.23)
      .reduce((curr, prev) => curr + prev, 0)
      .toFixed(2);

    return {
      status: true,
      basket: basket.map((item) => BasketService.basketFilter(item)),
      totalPrice
    };
  }

  async getTotalBasketPrice(userId: string) {
    const user = await Customer.findOne({ where: { id: userId } });

    const basket = await BasketEntity.find({
      where: {
        user: user as unknown as FindOneInterface
      },
      relations: ["productItems"]
    });

    if (basket.length === 0) {
      throw new HttpException("Your basket is empty", HttpStatus.NOT_FOUND);
    }

    return basket
      .map((item) => item.productItems.productPrice * item.quantity * 1.23)
      .reduce((curr, prev) => curr + prev, 0)
      .toFixed(2);
  }
}
