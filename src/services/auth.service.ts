import { TokenStorage } from "@/lib/token-storage";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_BASE_PATH = "/api/v1/auth";

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

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    avatar?: string;
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
    emailVerified: boolean;
    createdAt: string;
  };
}

export interface VerifyEmailResponse {
  message: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
}

export interface ResendVerificationData {
  email: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface LogoutData {
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

class AuthService {
  /**
   * Đăng ký tài khoản mới với email và password
   */
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

  /**
   * Đăng nhập với email và password
   * Tokens will be returned in response body and stored in localStorage
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await authAxios.post<AuthResponse>(
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

  /**
   * Đăng xuất khỏi hệ thống (vô hiệu hóa refresh token)
   */
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

  /**
   * Làm mới access token (uses localStorage)
   */
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

  /**
   * Xác thực email với token từ email
   */
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

  /**
   * Gửi lại email xác thực
   */
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

  /**
   * Yêu cầu reset mật khẩu (gửi email chứa link reset)
   */
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

  /**
   * Reset mật khẩu với token từ email
   */
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
