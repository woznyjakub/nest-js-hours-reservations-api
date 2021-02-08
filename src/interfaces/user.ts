export interface CreateUserResponse {
  isSuccess: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export enum UserRole {
  User = 100,
  Admin = 200,
}
