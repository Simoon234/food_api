import { IsNumber, IsString } from "class-validator";

export class ShopDto {
  @IsString()
  address: string;

  @IsNumber()
  phone: number;

  @IsString()
  email: string;

  @IsString()
  hours: string;

  @IsString()
  city: string;
}