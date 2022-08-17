import {Customer} from "src/customers/entities/customer.entity";
import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TableType} from "../../types";

@Entity()
export class Reservation extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    doubleTable: number;

    @Column()
    quadrupleTable: number;

    @Column()
    sixPersonTable: number;

    @Column()
    reservationDate: string;

    @Column()
    reservationPassword: string;

    @Column()
    reservationToken: string;

    @Column({type: "enum", enum: TableType})
    tableType: TableType

    @OneToOne(() => Customer)
    @JoinColumn()
    reservedBy: Customer;
}