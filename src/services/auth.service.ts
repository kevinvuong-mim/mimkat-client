import { Token } from "@/lib/token";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Axios instance riêng cho auth (không dùng interceptors)
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
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

      const authData = response.data;

      // Store tokens in localStorage
      Token.save(authData.accessToken, authData.refreshToken);

      return authData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  }

  async logout(): Promise<{ message: string }> {
    const refreshToken = Token.getRefreshToken();
    const accessToken = Token.getAccessToken();

    if (!refreshToken || !accessToken) {
      // Clear tokens anyway and return
      Token.clear();
      return { message: "Already logged out" };
    }

    try {
      const response = await authAxios.post<{ message: string }>(
        "/auth/logout",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Logout failed");
      }
      throw error;
    } finally {
      // Always clear tokens from localStorage, even if logout request fails
      Token.clear();
    }
  }

  async refreshToken(): Promise<{
    message: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const refreshToken = Token.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    try {
      const response = await authAxios.post<{
        message: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>("/auth/refresh", { refreshToken });

      const data = response.data;

      // Update tokens in localStorage
      Token.save(data.accessToken, data.refreshToken);

      return data;
    } catch (error) {
      // Clear tokens on refresh failure
      Token.clear();

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
      const response = await authAxios.post<{ message: string }>(
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

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await authAxios.post<{ message: string }>(
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

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await authAxios.post<{ message: string }>(
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
