import { User } from "./user";

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
}

export interface VerifyEmailResponse {
  message: string;
}

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

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
