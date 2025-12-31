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
    const endpoint = '/auth/login';

    const response: LoginResponse = await apiClient.post(endpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logout = async (_data?: LogoutRequest) => {
  try {
    const endpoint = '/auth/logout';

    const response: LogoutResponse = await apiClient.post(endpoint);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const register = async (data: RegisterRequest) => {
  try {
    const endpoint = '/auth/register';

    const response: RegisterResponse = await apiClient.post(endpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const verifyEmail = async (data: VerifyEmailRequest) => {
  try {
    const endpoint = '/verification/email';

    const response: VerifyEmailResponse = await apiClient.get(endpoint, {
      params: { token: data.token },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const resetPassword = async (data: ResetPasswordRequest) => {
  try {
    const endpoint = '/verification/reset-password';

    const response: ResetPasswordResponse = await apiClient.post(endpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const forgotPassword = async (data: ForgotPasswordRequest) => {
  try {
    const endpoint = '/verification/forgot-password';

    const response: ForgotPasswordResponse = await apiClient.post(endpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const resendVerification = async (data: ResendVerificationRequest) => {
  try {
    const endpoint = '/verification/resend';

    const response: ResendVerificationResponse = await apiClient.post(endpoint, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export { login, logout, register, verifyEmail, resetPassword, forgotPassword, resendVerification };
