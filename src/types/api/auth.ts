import { SuccessResponse } from '../';

// Requests
interface LoginRequest {
  email: string;
  password: string;
}

interface LogoutRequest {}

interface RegisterRequest {
  email: string;
  password: string;
}

interface VerifyEmailRequest {
  token: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResendVerificationRequest extends ForgotPasswordRequest {}

// Responses
interface LoginResponse extends SuccessResponse<{
  accessToken: string;
  refreshToken: string;
}> {}

interface LogoutResponse extends SuccessResponse<null> {}

interface RegisterResponse extends SuccessResponse<null> {}

interface VerifyEmailResponse extends SuccessResponse<null> {}

interface ResetPasswordResponse extends SuccessResponse<null> {}

interface ForgotPasswordResponse extends SuccessResponse<null> {}

interface ResendVerificationResponse extends SuccessResponse<null> {}

export type {
  // Requests
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  ResendVerificationRequest,

  // Responses
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  VerifyEmailResponse,
  ResetPasswordResponse,
  ForgotPasswordResponse,
  ResendVerificationResponse,
};
