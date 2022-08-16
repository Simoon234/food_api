import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {database, password, username} from "../db-config";
import {ProductsModule} from './products/products.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username,
    password,
    database,
    entities: [],
    synchronize: true,
  }), ProductsModule],
})
export class AppModule {}
