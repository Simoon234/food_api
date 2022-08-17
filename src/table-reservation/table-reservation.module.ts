import {Module} from '@nestjs/common';
import {TableReservationController} from './table-reservation.controller';
import {TableReservationService} from './table-reservation.service';

@Module({
  controllers: [TableReservationController],
  providers: [TableReservationService]
})
export class TableReservationModule {
}
