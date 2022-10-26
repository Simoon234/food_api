import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { TableReservationService } from "./table-reservation.service";
import { TableReservationDto } from "./dto/table-reservation.dto";
import { Person } from "../decorators/person.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Controller("table-reservation")
export class TableReservationController {
  constructor(private tables: TableReservationService) {
  }

  @Get("/available")
  getAllAvailableTables() {
    return this.tables.getAllAvailableTables();
  }

  @UseGuards(JwtGuard)
  @Post("/reserve")
  reserveTable(
    @Person() person: any,
    @Body() reservation: TableReservationDto
  ) {
    return this.tables.reserveTable(person, reservation);
  }

  @Get("/change-status/:id")
  changeStatus(@Param("id") id: string) {
    return this.tables.changedTableStatus(id);
  }
}
