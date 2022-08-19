import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetailsCustomer } from "./details-customer.entity";
import { BasketEntity } from "../../basket/entities/basket.entity";

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @OneToOne(() => DetailsCustomer)
  @JoinColumn()
  details: DetailsCustomer;

  @OneToMany(() => BasketEntity, (entity) => entity.user)
  itemsInBasket: BasketEntity[];
}
