import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  ResendVerificationRequest,
} from '@/types';
import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/auth/login', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const register = async (data: RegisterRequest) => {
  try {
    const response = await apiClient.post('/auth/register', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const verifyEmail = async (token: string) => {
  try {
    const response = await apiClient.get('/verification/email', {
      params: { token },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const resetPassword = async (data: ResetPasswordRequest) => {
  try {
    const response = await apiClient.post('/verification/reset-password', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const forgotPassword = async (data: ForgotPasswordRequest) => {
  try {
    const response = await apiClient.post(`/verification/forgot-password`, data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const resendVerification = async (data: ResendVerificationRequest) => {
  try {
    const response = await apiClient.post('/verification/resend', data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export { login, logout, register, verifyEmail, resetPassword, forgotPassword, resendVerification };
