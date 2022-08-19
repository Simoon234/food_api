import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BasketEntity } from './entities/basket.entity';
import { BasketReturnValue, FindOneInterface } from '../types';
import { Product } from '../products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Injectable()
export class BasketService {
  async addToBasket(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<BasketReturnValue> {
    const productItem = await Product.findOne({ where: { id: productId } });

    const user = await Customer.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (!productItem)
      throw new HttpException(
        'Sorry, no product with id ' + productId + ' found',
        HttpStatus.NOT_FOUND,
      );

    const basket = new BasketEntity();
    basket.quantity = quantity;

    await basket.save();

    basket.user = user;
    basket.productItems = productItem;

    await basket.save();

    return {
      quantity,
      userId: user.id,
      productId: productItem.id,
    };
  }

  async getBasket(id: string) {
    const user = await Customer.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('There is no user', HttpStatus.BAD_REQUEST);
    }
    const basket = await BasketEntity.find({
      where: {
        user: user as unknown as FindOneInterface,
      },
      relations: ['productItems'],
    });


    return {
      status: true,
      basket: basket.map((item) => {
        return {
          name: item.productItems.productName,
        };
      }),
    };
  }
}
