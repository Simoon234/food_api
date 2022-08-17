import {PartialType} from '@nestjs/mapped-types';
import {CreateProductDto} from './create-product.dto';
import {IsNumber, IsString} from "class-validator";

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    productName: string;

    @IsNumber()
    productPrice: number;

    @IsNumber()
    productQuantity: number;
    @IsString()
    productImage: string;
}
