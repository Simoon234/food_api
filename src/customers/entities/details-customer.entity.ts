import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DetailsCustomer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, default: 0 })
  phoneNumber: number;

  @Column({ nullable: true, default: null })
  city: string;

  @Column({ nullable: true, default: null })
  country: string;
}
