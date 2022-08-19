import {IsDate, IsNumber, IsString} from "class-validator";

export class TableReservationDto {

    @IsString()
    password: string;

    @IsNumber()
    chosenNumberOfTable: number;

    @IsDate()
    reservationDate: Date;
}