import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Customer} from 'src/customers/entities/customer.entity';
import {Reservation} from "./entity/reservations.entity";
import {hashPassword} from "../utils/hashPassword";
import {TableReservationDto} from "./dto/table-reservation.dto";

@Injectable()
export class TableReservationService {
    async getAllAvailableTables() {
        return Reservation.find();
    }

    async reserveTable(id: string, {
        chosenNumberOfTable,
        password,
        reservationDate
    }: TableReservationDto) {
        const user = await Customer.findOne({where: {id}});
        let hashPwd = '';
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        hashPwd = await hashPassword(password);
        const newReservation = new Reservation();
        newReservation.reservationPassword = hashPwd;
        newReservation.reservedBy = user;
        newReservation.reservationDate = reservationDate;
        newReservation.tableType = chosenNumberOfTable;

        await newReservation.save();

        return {
            newReservation,
            status: true
        }

    }
}
