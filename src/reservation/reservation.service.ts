import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { getConnection } from 'typeorm';
import {
  CreateReservationResponse,
  GetStatsResponse,
  ReservationItem,
  ReservationStatus,
  UpdateReservationResponse,
} from '../interfaces/reservation';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetReservationsStatsDto } from './dto/get-reservations-stats.dto';
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

    const reservations = await getConnection()
      .createQueryBuilder()
      .select('reservation')
      .from(Reservation, 'reservation')
      .where(
        'reservation.startDate BETWEEN :intervalStartDate and :intervalEndDate',
        {
          intervalStartDate,
          intervalEndDate,
        },
      )
      .orderBy('reservation.startDate', 'ASC')
      .getMany();

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

  async updateStatus(
    id: string,
    status: ReservationStatus,
  ): Promise<UpdateReservationResponse> {
    const reservation = await Reservation.update({ id }, { status });

    if (reservation) {
      return {
        isSuccess: true,
        message:
          'Successfully updated reservation or the reservation has this value already set.',
        data: {
          reservationId: id,
        },
      };
    }

    return {
      isSuccess: false,
      message: `Cannot find reservation with ${id} id.`,
    };
  }

  async getReservations(options: {
    getAll?: boolean;
    user?: User;
  }): Promise<ReservationItem[]> {
    const { getAll, user } = options;

    if (!getAll) {
      if (user) {
        return Reservation.find({
          relations: ['user'],
          where: {
            user: {
              id: user.id,
            },
          },
        });
      }

      throw new UnauthorizedException('User not provided.');
    }

    return Reservation.find();
  }
}
