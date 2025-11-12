import { apiClient } from "@/lib/api";
import axios from "axios";

const API_BASE_PATH = "/users";

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}

export interface Session {
  id: string;
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
}

class UserService {
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(
        `${API_BASE_PATH}/password`,
        data
      );
      return response.data;
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
      const response = await apiClient.delete<{ message: string }>(
        `${API_BASE_PATH}/sessions/${tokenId}`
      );
      return response.data;
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
      const response = await apiClient.delete<{ message: string }>(
        `${API_BASE_PATH}/sessions`
      );
      return response.data;
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
