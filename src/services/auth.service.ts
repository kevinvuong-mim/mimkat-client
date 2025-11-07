import { TokenStorage } from '@/lib/token-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_BASE_PATH = "/api/v1/auth";

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
    provider?: string;
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

class AuthService {
  /**
   * Đăng ký tài khoản mới với email và password
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}${API_BASE_PATH}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  /**
   * Đăng nhập với email và password
   * Tokens will be returned in response body and stored in localStorage
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}${API_BASE_PATH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const authData: AuthResponse = await response.json();

    // Store tokens in localStorage
    TokenStorage.saveTokens(authData.accessToken, authData.refreshToken);

    return authData;
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
      return { message: 'Already logged out' };
    }

    try {
      const response = await fetch(`${API_URL}${API_BASE_PATH}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Logout failed");
      }

      return await response.json();
    } finally {
      // Always clear tokens from localStorage, even if logout request fails
      TokenStorage.clearTokens();
    }
  }

  /**
   * Làm mới access token (uses localStorage)
   */
  async refreshToken(): Promise<{ message: string; accessToken: string; refreshToken: string; expiresIn: number }> {
    const refreshToken = TokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await fetch(`${API_URL}${API_BASE_PATH}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      // Clear tokens on refresh failure
      TokenStorage.clearTokens();
      throw new Error(error.message || "Token refresh failed");
    }

    const data = await response.json();

    // Update tokens in localStorage
    TokenStorage.saveTokens(data.accessToken, data.refreshToken);

    return data;
  }

  /**
   * Xác thực email với token từ email
   */
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const response = await fetch(
      `${API_URL}${API_BASE_PATH}/verify-email?token=${token}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Email verification failed");
    }

    return response.json();
  }

  /**
   * Gửi lại email xác thực
   */
  async resendVerification(
    data: ResendVerificationData
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${API_URL}${API_BASE_PATH}/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to resend verification email");
    }

    return response.json();
  }

}

export const authService = new AuthService();
