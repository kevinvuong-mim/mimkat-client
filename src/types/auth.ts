import { ApiResponse } from './api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse extends ApiResponse<{
  accessToken: string;
  refreshToken: string;
}> {}

interface RegisterRequest {
  email: string;
  password: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResendVerificationRequest {
  email: string;
}

export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  ResendVerificationRequest,
};
