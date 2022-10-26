import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReservationDetails extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  doubleTable: number;

  @Column()
  quadrupleTable: number;

  @Column()
  sixPersonTable: number;
}
