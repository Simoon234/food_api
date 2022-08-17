import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {DetailsCustomer} from "./details-customer.entity";

@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: false})
    email: string;

    @OneToOne(() => DetailsCustomer)
    @JoinColumn()
    details: DetailsCustomer;

}
