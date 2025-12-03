import {
  Session,
  PaginatedResponse,
  PublicUserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from "@/types";
import { apiClient } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";

const API_BASE_PATH = "/users";

class UsersService {
  async getProfile() {
    try {
      const response = await apiClient.get(`${API_BASE_PATH}/me`);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getProfileByIdentifier(identifier: string): Promise<PublicUserProfile> {
    try {
      const response = await apiClient.get(`${API_BASE_PATH}/${identifier}`);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async changePassword(data: ChangePasswordData) {
    try {
      const response = await apiClient.put(`${API_BASE_PATH}/password`, data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getSessions(): Promise<PaginatedResponse<Session>> {
    try {
      const response = await apiClient.get(`${API_BASE_PATH}/sessions`);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logoutDevice(tokenId: string) {
    try {
      const response = await apiClient.delete(
        `${API_BASE_PATH}/sessions/${tokenId}`
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logoutAllDevices() {
    try {
      const response = await apiClient.delete(`${API_BASE_PATH}/sessions`);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateProfile(data: UpdateProfileData) {
    try {
      const response = await apiClient.put(`${API_BASE_PATH}/me`, data);

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async uploadAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.put(
        `${API_BASE_PATH}/me/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const usersService = new UsersService();
