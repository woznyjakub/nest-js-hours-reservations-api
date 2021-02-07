export interface CreateUserResponse {
  isSuccess: boolean;
  message: string;
}

export enum UserRole {
  User = 100,
  Admin = 200,
}
