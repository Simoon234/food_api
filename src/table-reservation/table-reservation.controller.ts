import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {TableReservationService} from "./table-reservation.service";
import {TableReservationDto} from "./dto/table-reservation.dto";

@Controller('table-reservation')
export class TableReservationController {
    constructor(private tables: TableReservationService) {
    }

    @Get('/available')
    getAllAvailableTables() {
        return this.tables.getAllAvailableTables();
    }

    @Post('/reserve/:id')
    reserveTable(
        @Param('id') id: string,
        @Body() reservation: TableReservationDto
    ) {
        return this.tables.reserveTable(id, reservation)
    }
}
