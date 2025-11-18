import {
  RegisterData,
  LoginData,
  LoginResponse,
  ResendVerificationData,
  ForgotPasswordData,
  ResetPasswordData,
  RefreshTokenResponse,
} from "@/types";
import { ApiResponse } from "@/types";
import { API_URL } from "@/lib/constants";
import axios from "axios";

// Axios instance riêng cho auth (không dùng interceptors)
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for CORS requests
});

class AuthService {
  async register(data: RegisterData) {
    try {
      const response = await authAxios.post("/auth/register", data);
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
      const response = await authAxios.post("/auth/login", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  }

  async logout() {
    try {
      const response = await authAxios.post("/auth/logout");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Logout failed");
      }
      throw error;
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await authAxios.post("/auth/refresh");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Token refresh failed");
      }
      throw error;
    }
  }

  async verifyEmail(token: string) {
    try {
      const response = await authAxios.get(
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

  async resendVerification(data: ResendVerificationData) {
    try {
      const response = await authAxios.post<ApiResponse<null>>(
        "/verification/resend",
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to resend verification email"
        );
      }
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordData) {
    try {
      const response = await authAxios.post(
        `/verification/forgot-password`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to send password reset email"
        );
      }
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordData) {
    try {
      const response = await authAxios.post(
        "/verification/reset-password",
        data
      );
      return response.data;
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
