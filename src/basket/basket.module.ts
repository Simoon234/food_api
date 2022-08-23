import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { AdminModule } from "src/admin/admin.module";

@Module({
  imports: [TypeOrmModule.forFeature([BasketEntity]), AdminModule],
  controllers: [BasketController],
  providers: [BasketService]
})
export class BasketModule {
}
