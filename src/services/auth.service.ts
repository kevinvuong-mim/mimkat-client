import { TokenStorage } from "@/lib/token-storage";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_BASE_PATH = "/auth";

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
        `${API_BASE_PATH}/register`,
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
      const response = await authAxios.post<LoginResponse>(
        `${API_BASE_PATH}/login`,
        data
      );

      const authData = response.data;

      // Store tokens in localStorage
      TokenStorage.saveTokens(authData.accessToken, authData.refreshToken);

      return authData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  }

  async logout(): Promise<{ message: string }> {
    const refreshToken = TokenStorage.getRefreshToken();
    const accessToken = TokenStorage.getAccessToken();

    if (!refreshToken || !accessToken) {
      // Clear tokens anyway and return
      TokenStorage.clearTokens();
      return { message: "Already logged out" };
    }

    try {
      const response = await authAxios.post<{ message: string }>(
        `${API_BASE_PATH}/logout`,
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
      TokenStorage.clearTokens();
    }
  }

  async refreshToken(): Promise<{
    message: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const refreshToken = TokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    try {
      const response = await authAxios.post<{
        message: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>(`${API_BASE_PATH}/refresh`, { refreshToken });

      const data = response.data;

      // Update tokens in localStorage
      TokenStorage.saveTokens(data.accessToken, data.refreshToken);

      return data;
    } catch (error) {
      // Clear tokens on refresh failure
      TokenStorage.clearTokens();

      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Token refresh failed");
      }
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await authAxios.get<VerifyEmailResponse>(
        `${API_BASE_PATH}/verify-email?token=${token}`
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
        `${API_BASE_PATH}/resend-verification`,
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
        `${API_BASE_PATH}/forgot-password`,
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
        `${API_BASE_PATH}/reset-password`,
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
