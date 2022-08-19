import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Customer } from 'src/customers/entities/customer.entity';
import { Reservation } from './entity/reservations.entity';
import { hashPassword } from '../utils/hashPassword';
import { TableReservationDto } from './dto/table-reservation.dto';
import { ReservationDetails } from './entity/reservation-details.entity';
import { Res } from '../types';

@Injectable()
export class TableReservationService {
  private static async updateTable(chosenNumberOfTable) {
    const reservationAdminDetails = await (await ReservationDetails.find())[0];

    switch (chosenNumberOfTable) {
      case 2:
        if (reservationAdminDetails.doubleTable <= 0) {
          throw new HttpException(
            'Sorry, we do not have available tables',
            HttpStatus.BAD_REQUEST,
          );
        }
        await ReservationDetails.createQueryBuilder()
          .update(ReservationDetails)
          .set({ doubleTable: reservationAdminDetails.doubleTable - 1 })
          .where('id = :id', { id: reservationAdminDetails.id })
          .execute();
        break;
      case 4:
        if (reservationAdminDetails.quadrupleTable <= 0) {
          throw new HttpException(
            'Sorry, we do not have available tables',
            HttpStatus.BAD_REQUEST,
          );
        }
        await ReservationDetails.createQueryBuilder()
          .update(ReservationDetails)
          .set({ quadrupleTable: reservationAdminDetails.quadrupleTable - 1 })
          .where('id = :id', { id: reservationAdminDetails.id })
          .execute();
        break;

      case 6:
        if (reservationAdminDetails.sixPersonTable <= 0) {
          throw new HttpException(
            'Sorry, we do not have available tables',
            HttpStatus.BAD_REQUEST,
          );
        }
        await ReservationDetails.createQueryBuilder()
          .update(ReservationDetails)
          .set({ sixPersonTable: reservationAdminDetails.sixPersonTable - 1 })
          .where('id = :id', { id: reservationAdminDetails.id })
          .execute();
        break;
    }
    return chosenNumberOfTable;
  }

  async getAllAvailableTables() {
    return Reservation.find({ relations: ['reservedBy'] });
  }

  async reserveTable(
    id: string,
    { chosenNumberOfTable, password, reservationDate }: TableReservationDto,
  ) {
    const user = await Customer.findOne({ where: { id } });
    let hashPwd = '';
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (chosenNumberOfTable !== (2 || 4 || 6)) {
      throw new HttpException(
        'We do not have that kind of table..Available tables are [2, 4, 6]',
        HttpStatus.NOT_FOUND,
      );
    }

    hashPwd = await hashPassword(password);
    const newReservation = new Reservation();
    newReservation.reservationPassword = hashPwd;
    newReservation.reservedBy = user;
    newReservation.reservationDate = reservationDate;
    newReservation.tableType = chosenNumberOfTable;

    const getAllReservations = await Reservation.find({
      relations: ['reservedBy'],
    });

    getAllReservations.map((item) => {
      if (item.reservedBy.id === user.id) {
        throw new HttpException(
          'You have reservation.',
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    if (chosenNumberOfTable === 2) {
      await TableReservationService.updateTable(2);
    }

    if (chosenNumberOfTable === 4) {
      await TableReservationService.updateTable(4);
    }

    if (chosenNumberOfTable === 6) {
      await TableReservationService.updateTable(6);
    }

    await newReservation.save();

    return {
      newReservation,
      status: true,
    };
  }

  async changedTableStatus(id: string): Promise<Res> {
    const getReservation = await Reservation.findOne({
      where: { id },
      relations: ['reservedBy'],
    });

    if (getReservation === null) {
      throw new HttpException(
        'Can not find reservation',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tableType = getReservation.tableType;
    const allReservations = await (await ReservationDetails.find())[0];

    switch (tableType) {
      case 2:
        await ReservationDetails.createQueryBuilder()
          .update(ReservationDetails)
          .set({ doubleTable: allReservations.doubleTable + 1 })
          .where('id = :id', { id: allReservations.id })
          .execute();
        break;
      case 4:
        await ReservationDetails.createQueryBuilder()
          .update(ReservationDetails)
          .set({ quadrupleTable: allReservations.quadrupleTable + 1 })
          .where('id = :id', { id: allReservations.id })
          .execute();
        break;

      case 6:
        await ReservationDetails.createQueryBuilder()
          .update(ReservationDetails)
          .set({ sixPersonTable: allReservations.sixPersonTable + 1 })
          .where('id = :id', { id: allReservations.id })
          .execute();
        break;
    }

    await Reservation.createQueryBuilder()
      .delete()
      .from(Reservation)
      .where('id = :id', { id })
      .execute();

    return {
      status: true,
    };
  }
}
