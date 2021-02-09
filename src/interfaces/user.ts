import { Reservation } from '../reservation/entities/reservation.entity';

export interface CreateUserResponse {
  isSuccess: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export interface UserItem {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  reservations: Reservation[];
}

export enum UserRole {
  User = 100,
  Admin = 200,
}
