import {
  LoginRequest,
  LogoutRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
} from '@/types';
import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';

const login = async (data: LoginRequest) => {
  try {
    const response: LoginResponse = await apiClient.post('/auth/login', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logout = async (_data?: LogoutRequest) => {
  try {
    const response: LogoutResponse = await apiClient.post('/auth/logout');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const register = async (data: RegisterRequest) => {
  try {
    const response: RegisterResponse = await apiClient.post('/auth/register', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const verifyEmail = async (data: VerifyEmailRequest) => {
  try {
    const response: VerifyEmailResponse = await apiClient.get('/verification/email', {
      params: { token: data.token },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const resetPassword = async (data: ResetPasswordRequest) => {
  try {
    const response: ResetPasswordResponse = await apiClient.post(
      '/verification/reset-password',
      data,
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const forgotPassword = async (data: ForgotPasswordRequest) => {
  try {
    const response: ForgotPasswordResponse = await apiClient.post(
      `/verification/forgot-password`,
      data,
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const resendVerification = async (data: ResendVerificationRequest) => {
  try {
    const response: ResendVerificationResponse = await apiClient.post('/verification/resend', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export { login, logout, register, verifyEmail, resetPassword, forgotPassword, resendVerification };
