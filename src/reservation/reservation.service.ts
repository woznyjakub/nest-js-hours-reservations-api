import { Injectable } from '@nestjs/common';
import { CreateReservationResponse } from 'src/interfaces/reservation';
import { CreateReservationDto } from './dto/create-reservation.dto';
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

  getAllReservations() {
    return Reservation.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
