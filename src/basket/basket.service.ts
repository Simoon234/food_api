import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BasketEntity } from "./entities/basket.entity";
import { BasketReturnValue, FindOneInterface, Res } from "../types";
import { Product } from "../products/entities/product.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Stripe } from "stripe";

@Injectable()
export class BasketService {
  constructor(@Inject("STRIPE_CLIENT") private stripe: Stripe) {
  }

  private static basketFilter(obj: BasketEntity) {
    return {
      basketId: obj.id,
      quantity: obj.quantity,
      id: obj.productItems.id,
      productName: obj.productItems.productName,
      productCategory: obj.productItems.productCategory,
      productPrice: obj.productItems.productPrice,
      productImage: obj.productItems.productImage,
      boughtTimes: obj.productItems.boughtTimes,
      user: {
        id: obj.user.id,
        email: obj.user.email
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
      id: productItem.id,
      productPrice: productItem.productPrice,
      productImage: productItem.productImage,
      productName: productItem.productName
    };
  }

  async getBasket(person) {
    const user = await Customer.findOne({
      where: { id: person.id }
    });

    if (!user) {
      throw new HttpException("There is no user", HttpStatus.BAD_REQUEST);
    }
    const basket = await BasketEntity.find({
      where: {
        user: {
          id: user.id
        }
      },
      relations: ["productItems", "user"]
    });

    const totalPrice = basket
      .map((item) => item.productItems.productPrice * item.quantity * 1.23)
      .reduce((curr, prev) => curr + prev, 0)
      .toFixed(2);

    return {
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

  async checkout(res: any, person: any) {
    const { basket } = await this.getBasket(person.id);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik"],
      line_items: basket.map((item) => {
        return {
          price_data: {
            currency: "pln",
            product_data: {
              name: item.productName,
              images: [item.productImage]
            },
            unit_amount: item.productPrice * 100,
            tax_behavior: "exclusive"
          },
          quantity: item.quantity
        };
      }),
      automatic_tax: {
        enabled: true
      },
      shipping_address_collection: {
        allowed_countries: ["PL"]
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "pln"
            },
            tax_behavior: "exclusive",
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5
              },
              maximum: {
                unit: "business_day",
                value: 7
              }
            }
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "pln"
            },
            tax_behavior: "exclusive",
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1
              },
              maximum: {
                unit: "business_day",
                value: 1
              }
            }
          },
        },
      ],
      allow_promotion_codes: true,
      mode: "payment",
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:4242/cancel.html"
    });
    const { id } = basket.find((item) => item.id);
    await this.updateProductBought(id);
    await this.clearBasket(person.id);
    res.json({ success: true, url: session.url });
  }

  async removeProductFromBasket(person: any, basketId: string): Promise<Res> {
    const user = await Customer.findOne({ where: { id: person.id } });

    if (!user) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    const basket = await BasketEntity.findOne({
      where: {
        id: basketId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName
        }
      }
    });

    if (basket) {
      await basket.remove();
      return {
        status: true
      };
    } else {
      return {
        status: false,
        message: "Error..."
      };
    }
  }

  async clearBasket(userId: string): Promise<Res> {
    const user = await Customer.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    const basket = await BasketEntity.createQueryBuilder()
      .delete()
      .from(BasketEntity)
      .where("user = :user", {
        user: userId
      })
      .execute();

    if (basket.affected <= 0) {
      return {
        status: false,
        message: "Basket is empty..."
      };
    } else {
      return {
        status: true
      };
    }
  }

  async updateProductBought(id: string) {
    const findProd = await Product.findOne({ where: { id } });
    findProd.boughtTimes += 1;
    await findProd.save();
  }

  async increaseQuantity(user: any, id: string) {
    const itemsInBasket = await BasketEntity.findOne({
      where: {
        user,
        productItems: { id }
      },
      relations: ["productItems", "user"]
    });
    itemsInBasket.quantity++;
    await itemsInBasket.save();

    return itemsInBasket;
  }

  async decreaseQuantity(user: any, id: string) {
    const itemsInBasket = await BasketEntity.findOne({
      where: {
        user,
        productItems: { id }
      },
      relations: ["productItems", "user"]
    });
    itemsInBasket.quantity--;
    await itemsInBasket.save();

    return itemsInBasket;
  }
}
