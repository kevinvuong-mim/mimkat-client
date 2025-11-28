import axios from "axios";

import {
  LoginData,
  RegisterData,
  LoginResponse,
  ResetPasswordData,
  ForgotPasswordData,
  RefreshTokenResponse,
  ResendVerificationData,
} from "@/types";
import { API_URL } from "@/lib/constants";

const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

class AuthService {
  async register(data: RegisterData) {
    try {
      const response = await authAxios.post("/auth/register", data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async resendVerification(data: ResendVerificationData) {
    try {
      const response = await authAxios.post("/verification/resend", data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
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
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
