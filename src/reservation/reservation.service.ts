import { Injectable } from '@nestjs/common';
import {
  CreateReservationResponse,
  GetStatsResponse,
  ReservationItem,
  ReservationStatus,
} from '../interfaces/reservation';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetReservationsStatsDto } from './dto/get-reservations-stats.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<CreateReservationResponse> {
    const { startDate: startDateString } = createReservationDto;
    const startDate = new Date(startDateString);

    if (this.isDateAFullHour(startDate)) {
      //
      if (await this.isReservationExist(startDate)) {
        return {
          isSuccess: false,
          message: `Reservation with ${startDateString} startdate already exists.`,
        };
      }

      const reservation = new Reservation();
      reservation.startDate = startDate;

      await reservation.save();

      return {
        isSuccess: true,
        message: 'Reservation successfully created (available to reserve).',
        data: {
          startDate: reservation.startDate,
          reservationId: reservation.id,
        },
      };
    }

    return {
      isSuccess: false,
      message: `startDate must be a full hour, ${startDateString} received.`,
    };
  }

  isDateAFullHour(date: Date) {
    const getters = [date.getMinutes, date.getSeconds, date.getMilliseconds];

    // getter must have applied `date` as `this` again to prevent throwing error `TypeError: this is not a Date object`
    return getters.every((getter) => getter.apply(date) === 0);
  }

  async isReservationExist(startDate: Date): Promise<boolean> {
    const reservations = await Reservation.find({ startDate });

    console.log(reservations);
    return !!reservations.length;
  }

  async getStats(
    getStatsDto: GetReservationsStatsDto,
  ): Promise<GetStatsResponse> {
    const { intervalStartDate, intervalEndDate } = getStatsDto;
    /**
     * @todo: rewrite it to use query builder and use filtering by optional start and end interval dates
     */
    const reservations = await Reservation.find();

    console.log(reservations);
    const result: GetStatsResponse = {};

    reservations.forEach((reservation: ReservationItem) => {
      const { startDate, status } = reservation;

      // get YYYY-MM-DD format
      const dayDate = new Date(startDate).toISOString().split('T')[0];

      if (!result[dayDate]) {
        result[dayDate] = {
          reservedHours: 0,
          freeHours: 0,
          blockedHours: 0,
        };
      }

      switch (status) {
        case ReservationStatus.Disabled:
          result[dayDate].blockedHours++;
          break;
        case ReservationStatus.Available:
          result[dayDate].freeHours++;
          break;
        case ReservationStatus.Ordered:
          result[dayDate].reservedHours++;
          break;
        case ReservationStatus.Confirmed:
          result[dayDate].reservedHours++;
          break;
      }
    });

    return result;
  }

  confirm(updateReservationDto: UpdateReservationDto) {
    throw new Error('Method not implemented.');
  }

  disable(updateReservationDto: UpdateReservationDto) {
    throw new Error('Method not implemented.');
  }

  getAllReservations() {
    return Reservation.find();
  }
}
