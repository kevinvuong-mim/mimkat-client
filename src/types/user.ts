import { ApiResponse } from "./api";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  hasPassword: boolean;
  hasGoogleAuth: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserContextType {
  user: User | null;
}

export interface GetUserResponse extends ApiResponse<User> {}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}
