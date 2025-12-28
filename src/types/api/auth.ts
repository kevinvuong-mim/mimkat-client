import { SuccessResponse } from '../';

// Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResendVerificationRequest extends ForgotPasswordRequest {}

// Responses
export interface LoginResponse extends SuccessResponse<{
  accessToken: string;
  refreshToken: string;
}> {}

export interface LogoutResponse extends SuccessResponse<null> {}

export interface RegisterResponse extends SuccessResponse<null> {}

export interface VerifyEmailResponse extends SuccessResponse<null> {}

export interface ResetPasswordResponse extends SuccessResponse<null> {}

export interface ForgotPasswordResponse extends SuccessResponse<null> {}

export interface ResendVerificationResponse extends SuccessResponse<null> {}
