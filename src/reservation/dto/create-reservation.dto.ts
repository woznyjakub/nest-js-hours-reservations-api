import { IsDateString, MinDate } from 'class-validator';

export class CreateReservationDto {
  @IsDateString({ strict: true })
  /**
   * @todo: check why MinDate & MaxDate don't work here - they block all dates
   */
  // @MinDate(new Date())
  startDate: string;
}
