import {Product} from "src/products/entities/product.entity";

export enum Categories {
    pizza = 'PIZZA',
    drink = 'DRINK',
    burger = 'BURGER',
    steak = 'STEAK'
}

export interface AllProducts {
    message?: string;
    status: boolean;
    allProducts?: Product[];
}

export interface Res {
    status: boolean;
}

export interface ResSingleProduct {
    status: boolean;
    singleProduct: Product | string;
}

export interface CreateProductInterface {
    productName: string;
    productPrice: number;
    productQuantity: number;
    productImage: string;
}