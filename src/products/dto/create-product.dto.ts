import {IsDefined, IsEnum, IsNumber, IsString} from "class-validator";
import {Categories, CreateProductInterface} from "../../types";

export class CreateProductDto implements CreateProductInterface {

    @IsString()
    @IsDefined()
    productName: string;

    @IsNumber()
    @IsDefined()
    productPrice: number;

    @IsNumber()
    @IsDefined()
    productQuantity: number;

    @IsEnum(Categories)
    productCategory: Categories


    @IsString()
    @IsDefined()
    productImage: string;

}
