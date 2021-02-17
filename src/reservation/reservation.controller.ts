import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  ConfirmReservationResponse,
  CreateReservationResponse,
  DisableReservationResponse,
  GetStatsResponse,
  ReservationItem,
  ReservationStatus,
} from '../interfaces/reservation';
import { GetReservationsStatsDto } from './dto/get-reservations-stats.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObject } from 'src/decorators/user-object.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/user')
  @UseGuards(AuthGuard('jwt'))
  getReservations(@UserObject() user: User): Promise<ReservationItem[]> {
    return this.reservationService.getReservations({ user });
  }

  // admin
  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  getAllReservations(): Promise<ReservationItem[]> {
    return this.reservationService.getReservations({ getAll: true });
  }

  // admin
  @Post('/create')
  create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<CreateReservationResponse> {
    return this.reservationService.create(createReservationDto);
  }

  @Get('/stats')
  getReservationsStats(
    @Body() getReservationsStatsDto: GetReservationsStatsDto,
  ): Promise<GetStatsResponse> {
    return this.reservationService.getStats(getReservationsStatsDto);
  }

  // admin
  @Patch('/disable/:id')
  @UseGuards(AuthGuard('jwt'))
  disable(
    @Param('id') reservationId: string,
  ): Promise<DisableReservationResponse> {
    return this.reservationService.updateStatus(
      reservationId,
      ReservationStatus.Disabled,
    );
  }

  // admin
  @Patch('/confirm/:id')
  @UseGuards(AuthGuard('jwt'))
  confirm(
    @Param('id') reservationId: string,
  ): Promise<ConfirmReservationResponse> {
    return this.reservationService.updateStatus(
      reservationId,
      ReservationStatus.Confirmed,
    );
  }
}
