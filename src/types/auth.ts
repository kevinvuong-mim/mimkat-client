// Base API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Login response data (inside wrapper)
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends ApiResponse<LoginResponseData> {}

export interface RegisterResponse extends ApiResponse<null> {}

export interface VerifyEmailResponse extends ApiResponse<null> {}

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

// Refresh token response data (inside wrapper)
export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse
  extends ApiResponse<RefreshTokenResponseData> {}
