import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ShopDetailsEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  phone: number;

  @Column()
  email: string;

  @Column()
  hours: string;

  @Column({
    type: "float",
    precision: 7,
    scale: 4
  })
  lat: number;

  @Column({
    type: "float",
    precision: 7,
    scale: 4
  })
  lon: number;
}
