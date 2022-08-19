import {Customer} from "src/customers/entities/customer.entity";
import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Reservation extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    reservationDate: string;

    @Column()
    reservationPassword: string;

    @Column()
    tableType: number;

    @OneToOne(() => Customer)
    @JoinColumn()
    reservedBy: Customer;
}