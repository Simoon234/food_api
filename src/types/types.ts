import { Product } from "src/products/entities/product.entity";
import { Customer } from "../customers/entities/customer.entity";

export enum Categories {
  pizza = "PIZZA",
  drink = "DRINK",
  burger = "BURGER",
  steak = "STEAK",
}

export interface AllProducts {
  message?: string;
  status: boolean;
  allProducts?: Product[];
}

export interface Res {
  status: boolean;
  message?: string;
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

export interface CustomerResponse {
  status: boolean;
  customer: Customer | string;
}

export interface PersonInterface {
  id: string;
  accessToken: string;
  role: Role;
}

export interface UpdateUser {
  city: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  phoneNumber: number;
}

export interface BasketReturnValue {
  productId: string;
  quantity: number;
  userId: string;
  price: number;
}

export interface FindOneInterface {
  id: string;
  name: string;
  email: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  picture: string;
  password: string;
}

export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface Coupon {
  name: string;
  percent_off: number;
}