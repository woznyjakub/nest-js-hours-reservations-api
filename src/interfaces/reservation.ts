import { User } from '../user/entities/user.entity';

export interface ReservationItem {
  id: string;
  status: ReservationStatus;
  startDate: Date;
  user: User;
  createdAt: Date;
}

export enum ReservationStatus {
  Disabled = 100,
  Available = 200,
  Ordered = 300,
  Confirmed = 400,
}

export interface CreateReservationResponse {
  isSuccess: boolean;
  message: string;
  data?: {
    reservationId: string;
    startDate: Date;
  };
}

export type GetStatsResponse = Record<
  string,
  {
    reservedHours: number;
    freeHours: number;
    blockedHours: number;
  }
>;
