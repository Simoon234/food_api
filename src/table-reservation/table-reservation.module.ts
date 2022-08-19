import {Module} from '@nestjs/common';
import {TableReservationController} from './table-reservation.controller';
import {TableReservationService} from './table-reservation.service';
import {Reservation} from "./entity/reservations.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReservationDetails} from "./entity/reservation-details.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, ReservationDetails])],
  controllers: [TableReservationController],
  providers: [TableReservationService]
})
export class TableReservationModule {
}
