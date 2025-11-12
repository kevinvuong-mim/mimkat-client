import { apiClient } from "@/lib/api";
import axios from "axios";

const API_BASE_PATH = "/auth";

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}

class UserService {
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(
        `${API_BASE_PATH}/change-password`,
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
}

export const userService = new UserService();
