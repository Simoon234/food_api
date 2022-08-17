import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Details {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    phoneNumber: number;

    @Column({nullable: true, default: null})
    city: string;

    @Column({nullable: true, default: null})
    country: string;
}