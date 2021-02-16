export interface AuthLoginResponse {
  isSuccess: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export interface JwtTokenData {
  accessToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  id: string;
}
