import { Matches } from 'class-validator';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export class GetReservationsStatsDto {
  @Matches(datePattern)
  intervalStartDate: string;

  @Matches(datePattern)
  intervalEndDate: string;
}
