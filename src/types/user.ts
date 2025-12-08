export interface User {
  id: string;
  avatar?: string;
  createdAt: string;
  fullName?: string;
  username?: string;
}

export interface CurrentUser {
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

export interface UpdateProfileData {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
}

export interface ChangePasswordData {
  newPassword: string;
  currentPassword?: string;
}

export interface CurrentUserContextType {
  currentUser: null | CurrentUser;
}
