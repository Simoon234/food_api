import {IsString} from "class-validator";
import {DetailsCustomer} from "../entities/details-customer.entity";

export class UpdateCustomerDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string;

    details: DetailsCustomer
}
