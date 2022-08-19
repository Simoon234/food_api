import { IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @IsString()
  productId: string;

  @IsString()
  userId: string;

  @IsNumber()
  quantity: number;
}
