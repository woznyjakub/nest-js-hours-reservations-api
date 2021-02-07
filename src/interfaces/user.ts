import { ValidationErrors } from './validator';

export interface CreateUserResponse {
  isSuccess: boolean;
  errors: ValidationErrors;
}

export enum UserRole {
  User = 100,
  Admin = 200,
}
