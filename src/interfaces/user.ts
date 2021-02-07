import { ValidationErrors } from './validator';

export interface CreateUserResponse {
  isSuccess: boolean;
  errors: ValidationErrors;
}
