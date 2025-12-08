import { ApiResponse } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface LoginResponse extends ApiResponse<{
  accessToken: string;
  refreshToken: string;
}> {}
