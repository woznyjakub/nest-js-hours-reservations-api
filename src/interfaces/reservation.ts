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
