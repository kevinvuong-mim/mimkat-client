interface User {
  id: string;
  avatar?: string;
  createdAt: string;
  fullName?: string;
  username?: string;
}

interface CurrentUser {
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

interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
}

interface ChangePasswordRequest {
  newPassword: string;
  currentPassword?: string;
}

interface CurrentUserContextType {
  currentUser: null | CurrentUser;
}

export type {
  User,
  CurrentUser,
  UpdateProfileRequest,
  ChangePasswordRequest,
  CurrentUserContextType,
};
