import {
  LoginData,
  RegisterData,
  LoginResponse,
  ResetPasswordData,
  ForgotPasswordData,
  ResendVerificationData,
} from '@/types';
import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';

class AuthService {
  async register(data: RegisterData) {
    try {
      const response = await apiClient.post('/auth/register', data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login', data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async verifyEmail(token: string) {
    try {
      const response = await apiClient.get('/verification/email', {
        params: { token },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async resendVerification(data: ResendVerificationData) {
    try {
      const response = await apiClient.post('/verification/resend', data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async forgotPassword(data: ForgotPasswordData) {
    try {
      const response = await apiClient.post(`/verification/forgot-password`, data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async resetPassword(data: ResetPasswordData) {
    try {
      const response = await apiClient.post('/verification/reset-password', data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const authService = new AuthService();
