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
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  CreateReservationResponse,
  DisableReservationResponse,
  GetStatsResponse,
  ReservationItem,
} from '../interfaces/reservation';
import { GetReservationsStatsDto } from './dto/get-reservations-stats.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/user')
  getReservations(): Promise<ReservationItem[]> {
    // pass user object
    return this.reservationService.getReservations();
  }

  // admin
  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  getAllReservations(): Promise<ReservationItem[]> {
    return this.reservationService.getReservations({ isAll: true });
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reservationService.findOne(+id);
  // }

  // admin
  @Patch('/disable/:id')
  @UseGuards(AuthGuard('jwt'))
  disable(
    @Param('id') reservationId: string,
  ): Promise<DisableReservationResponse> {
    return this.reservationService.disable(reservationId);
  }

  // @Patch('/confirm/:id')
  // confirm(
  //   @Param('id') id: string,
  //   @Body() updateReservationDto: UpdateReservationDto,
  // ) {
  //   return this.reservationService.confirm(+id, updateReservationDto);
  // }
}
