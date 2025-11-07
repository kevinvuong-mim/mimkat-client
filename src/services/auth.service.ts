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
   * Tokens will be set as httpOnly cookies by server
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}${API_BASE_PATH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web",
      },
      credentials: "include", // Critical: allows cookies to be set
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    // Response no longer contains tokens (they're in cookies)
    return response.json();
  }

  /**
   * Đăng xuất khỏi hệ thống (vô hiệu hóa refresh token)
   */
  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}${API_BASE_PATH}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    return response.json();
  }

  /**
   * Làm mới access token (uses cookie)
   */
  async refreshToken(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}${API_BASE_PATH}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Token refresh failed");
    }

    return response.json();
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
