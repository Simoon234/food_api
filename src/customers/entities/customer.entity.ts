import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Details} from "./details-customer.entity";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: false})
    email: string;

    @OneToOne(() => Details)
    @JoinColumn()
    details: Details;

}
