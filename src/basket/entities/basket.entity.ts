import { Customer } from 'src/customers/entities/customer.entity';
import { FindOneInterface } from 'src/types';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class BasketEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (entity) => entity.productsInBasket)
  @JoinColumn()
  productItems: Product;

  @ManyToOne(() => Customer, (entity) => entity.itemsInBasket)
  @JoinColumn()
  user: Customer;
}
