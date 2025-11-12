import {
  RegisterData,
  LoginData,
  LoginResponse,
  RegisterResponse,
  VerifyEmailResponse,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  RefreshTokenResponse,
} from "@/types/auth";
import { ApiResponse } from "@/types/api";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Axios instance riêng cho auth (không dùng interceptors)
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for CORS requests
});

class AuthService {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await authAxios.post<RegisterResponse>(
        "/auth/register",
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw error;
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await authAxios.post<LoginResponse>("/auth/login", data);
      // Tokens are now automatically stored in httpOnly cookies by the server
      // No need to manually save tokens on client side
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await authAxios.post<ApiResponse<null>>(
        "/auth/logout",
        {} // No need to send refresh token - server will get it from cookies
      );
      // Cookies are automatically cleared by the server
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Logout failed");
      }
      throw error;
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await authAxios.post<RefreshTokenResponse>(
        "/auth/refresh",
        {} // No need to send refresh token - server will get it from cookies
      );
      // New tokens are automatically stored in httpOnly cookies by the server
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Token refresh failed");
      }
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await authAxios.get<VerifyEmailResponse>(
        `/verification/email?token=${token}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Email verification failed"
        );
      }
      throw error;
    }
  }

  async resendVerification(
    data: ResendVerificationData
  ): Promise<{ message: string }> {
    try {
      const response = await authAxios.post<ApiResponse<null>>(
        "/verification/resend",
        data
      );
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to resend verification email"
        );
      }
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await authAxios.post<ApiResponse<null>>(
        `/verification/forgot-password`,
        data
      );
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to send password reset email"
        );
      }
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await authAxios.post<ApiResponse<null>>(
        "/verification/reset-password",
        data
      );
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to reset password"
        );
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
