import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { database, key, password, username } from "../db-config";
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
import { StripeModule } from "./stripe/stripe.module";
import { AuthModule } from "./auth/auth.module";
import { AdminModule } from "./admin/admin.module";
import { ShopDetailsEntity } from "./admin/entity/shop-details.entity";

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
        BasketEntity,
        ShopDetailsEntity
      ],
      synchronize: true
    }),
    ProductsModule,
    CustomersModule,
    TableReservationModule,
    BasketModule,
    StripeModule,
    StripeModule.forRoot(key, { apiVersion: "2022-08-01" }),
    AuthModule,
    AdminModule
  ],
})
export class AppModule {}
