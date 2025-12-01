import {
  Session,
  PaginatedResponse,
  PublicUserProfile,
  ChangePasswordData,
} from "@/types";
import { apiClient } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";

const API_BASE_PATH = "/users";

class UserService {
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
}

export const userService = new UserService();
