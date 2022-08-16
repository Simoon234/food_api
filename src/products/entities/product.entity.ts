import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Categories} from "../../types";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    productName: string;

    @Column({
        type: 'enum',
        enum: Categories
    })
    productCategory: string

    @Column()
    productPrice: number;

    @Column()
    productQuantity: number;

    @Column()
    productOpinion: number;

    @Column()
    productAddedToFavourite: number;
}
