import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetailsCustomer } from "./details-customer.entity";
import { BasketEntity } from "../../basket/entities/basket.entity";
import { Role } from "../../types";

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

  @Column({})
  password: string;

  @Column({ default: null, nullable: true })
  accessToken: string | null;

  @Column()
  photos: string;

  @Column({ type: "enum", enum: Role, default: Role.CUSTOMER })
  roles: Role.CUSTOMER;

  @OneToOne(() => DetailsCustomer)
  @JoinColumn()
  details: DetailsCustomer;

  @OneToMany(() => BasketEntity, (entity) => entity.user)
  itemsInBasket: BasketEntity[];
}
