export interface User {
  id: string;
  avatar?: string;
  createdAt: string;
  fullName?: string;
  username?: string;
}

export interface CurrentUser extends User {
  email: string;
  isActive: boolean;
  updatedAt: string;
  hasPassword: boolean;
  phoneNumber?: string;
  hasGoogleAuth: boolean;
  isEmailVerified: boolean;
}

export interface CurrentUserContextType {
  currentUser: null | CurrentUser;
}
