import { apiClient } from "@/lib/api";
import { ChangePasswordData, SessionsResponse } from "@/types";
import axios, { AxiosResponse } from "axios";

const API_BASE_PATH = "/users";

class UserService {
  async changePassword(data: ChangePasswordData) {
    try {
      const response = await apiClient.put(`${API_BASE_PATH}/password`, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to change password"
        );
      }
      throw error;
    }
  }

  async getSessions(): Promise<AxiosResponse<SessionsResponse>> {
    try {
      const response = await apiClient.get(`${API_BASE_PATH}/sessions`);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get sessions"
        );
      }
      throw error;
    }
  }

  async logoutDevice(tokenId: string) {
    try {
      const response = await apiClient.delete(
        `${API_BASE_PATH}/sessions/${tokenId}`
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to logout device"
        );
      }
      throw error;
    }
  }

  async logoutAllDevices() {
    try {
      const response = await apiClient.delete(`${API_BASE_PATH}/sessions`);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to logout all devices"
        );
      }
      throw error;
    }
  }
}

export const userService = new UserService();
