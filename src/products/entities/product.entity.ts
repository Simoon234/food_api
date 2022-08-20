import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categories } from "../../types";
import { BasketEntity } from "../../basket/entities/basket.entity";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productName: string;

  @Column({
    type: "enum",
    enum: Categories
  })
  productCategory: string;

  @Column({
    type: "float",
    precision: 6,
    scale: 2,
    default: 0,
    nullable: false
  })
  productPrice: number;

  @Column()
  productQuantity: number;

  @Column()
  productOpinion: number;

  @Column()
  productAddedToFavourite: number;

  @Column()
  productImage: string;

  @OneToMany(() => BasketEntity, (entity) => entity.productItems)
  productsInBasket: BasketEntity[];
}
