import { apiClient } from "@/lib/api";
import {
  ChangePasswordData,
  ChangePasswordResponse,
  SessionsResponse,
  LogoutDeviceResponse,
} from "@/types/session";
import { ApiResponse } from "@/types/auth";
import axios from "axios";

const API_BASE_PATH = "/users";

class UserService {
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<ChangePasswordResponse>(
        `${API_BASE_PATH}/password`,
        data
      );
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to change password"
        );
      }
      throw error;
    }
  }

  async getSessions(refreshToken?: string): Promise<SessionsResponse> {
    try {
      const config = refreshToken
        ? {
            data: { refreshToken },
          }
        : undefined;

      const response = await apiClient.get<SessionsResponse>(
        `${API_BASE_PATH}/sessions`,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to get sessions"
        );
      }
      throw error;
    }
  }

  async logoutDevice(tokenId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<LogoutDeviceResponse>(
        `${API_BASE_PATH}/sessions/${tokenId}`
      );
      return { message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to logout device"
        );
      }
      throw error;
    }
  }

  async logoutAllDevices(): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `${API_BASE_PATH}/sessions`
      );
      return { message: response.data.message };
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
