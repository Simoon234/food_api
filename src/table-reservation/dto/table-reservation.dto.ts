import { IsDateString, IsNumber, IsString } from "class-validator";

export class TableReservationDto {
  @IsString()
  password: string;

  @IsNumber()
  chosenNumberOfTable: number;

  @IsDateString()
  reservationDate: string;

  @IsString()
  time: string;
}
