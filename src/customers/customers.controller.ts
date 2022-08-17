import {Body, Controller, Get, Param, Patch} from '@nestjs/common';
import {CustomersService} from './customers.service';
import {CustomerResponse, UpdateUser} from "../types";

@Controller('customer')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {
  }

  @Patch('/update-one/:id')
  update(@Param('id') id: string, @Body() updateCustomer: UpdateUser) {
    return this.customersService.updateCustomer(id, updateCustomer);
  }

  @Get('/details/:id')
  findOne(@Param('id') id: string): Promise<CustomerResponse> {
    return this.customersService.findOne(id);
  }
}
