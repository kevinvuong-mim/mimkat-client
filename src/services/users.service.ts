import { apiClient } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';
import { User, Session, PaginatedResponse, UpdateProfileData, ChangePasswordData } from '@/types';

class UsersService {
  async getMe() {
    try {
      const response = await apiClient.get('/users/me');

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getProfileByIdentifier(identifier: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${identifier}`);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async changePassword(data: ChangePasswordData) {
    try {
      const response = await apiClient.put('/users/password', data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getSessions(): Promise<PaginatedResponse<Session>> {
    try {
      const response = await apiClient.get('/users/sessions');

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logoutDevice(tokenId: string) {
    try {
      const response = await apiClient.delete(`/users/sessions/${tokenId}`);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logoutAllDevices() {
    try {
      const response = await apiClient.delete('/users/sessions');

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateProfile(data: UpdateProfileData) {
    try {
      const response = await apiClient.put('/users/me', data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async uploadAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const usersService = new UsersService();
