import {Module} from '@nestjs/common';
import {CustomersService} from './customers.service';
import {CustomersController} from './customers.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DetailsCustomer} from "./entities/details-customer.entity";
import {Customer} from "./entities/customer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Customer, DetailsCustomer])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule {
}
