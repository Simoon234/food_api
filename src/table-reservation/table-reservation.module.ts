import {Module} from '@nestjs/common';
import {TableReservationController} from './table-reservation.controller';
import {TableReservationService} from './table-reservation.service';
import {Reservation} from "./entity/reservations.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [TableReservationController],
  providers: [TableReservationService]
})
export class TableReservationModule {
}
