import axios, { AxiosResponse } from "axios";

import { apiClient } from "@/lib/api";
import { SessionsResponse, ChangePasswordData } from "@/types";

const API_BASE_PATH = "/users";

class UserService {
  async getProfile() {
    try {
      const response = await apiClient.get(`${API_BASE_PATH}/me`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async changePassword(data: ChangePasswordData) {
    try {
      const response = await apiClient.put(`${API_BASE_PATH}/password`, data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getSessions(): Promise<AxiosResponse<SessionsResponse>> {
    try {
      const response = await apiClient.get(`${API_BASE_PATH}/sessions`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async logoutDevice(tokenId: string) {
    try {
      const response = await apiClient.delete(
        `${API_BASE_PATH}/sessions/${tokenId}`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async logoutAllDevices() {
    try {
      const response = await apiClient.delete(`${API_BASE_PATH}/sessions`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export const userService = new UserService();
