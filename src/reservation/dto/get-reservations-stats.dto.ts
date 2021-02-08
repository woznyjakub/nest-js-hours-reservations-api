import { IsOptional, Matches } from 'class-validator';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export class GetReservationsStatsDto {
  @IsOptional()
  @Matches(datePattern)
  intervalStartDate: string;

  @IsOptional()
  @Matches(datePattern)
  intervalEndDate: string;
}
