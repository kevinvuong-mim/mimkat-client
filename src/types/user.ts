export interface User {
  id: string;
  email: string;
  avatar?: string;
  createdAt: string;
  fullName?: string;
  isActive: boolean;
  updatedAt: string;
  username?: string;
  hasPassword: boolean;
  phoneNumber?: string;
  hasGoogleAuth: boolean;
  isEmailVerified: boolean;
}

export interface PublicUserProfile {
  id: string;
  avatar?: string;
  createdAt: string;
  fullName?: string;
  username?: string;
}

export interface UserContextType {
  user: null | User;
}

export interface ChangePasswordData {
  newPassword: string;
  currentPassword?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
}
