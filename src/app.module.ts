import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { database, password, username } from "../db-config";
import { Product } from "./products/entities/product.entity";
import { ProductsModule } from "./products/products.module";
import { CustomersModule } from "./customers/customers.module";
import { DetailsCustomer } from "./customers/entities/details-customer.entity";
import { Customer } from "./customers/entities/customer.entity";
import { TableReservationModule } from "./table-reservation/table-reservation.module";
import { Reservation } from "./table-reservation/entity/reservations.entity";
import { ReservationDetails } from "./table-reservation/entity/reservation-details.entity";
import { BasketModule } from "./basket/basket.module";
import { BasketEntity } from "./basket/entities/basket.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username,
      password,
      database,
      entities: [
        Product,
        Customer,
        DetailsCustomer,
        Reservation,
        ReservationDetails,
        BasketEntity
      ],
      synchronize: true
    }),
    ProductsModule,
    CustomersModule,
    TableReservationModule,
    BasketModule
  ]
})
export class AppModule {}
