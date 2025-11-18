import { ApiResponse } from "./api";

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Login response data (inside wrapper)
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends ApiResponse<LoginResponseData> {}

export interface ResendVerificationData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

// Refresh token response data (inside wrapper)
export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse
  extends ApiResponse<RefreshTokenResponseData> {}
