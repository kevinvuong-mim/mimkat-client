interface User {
  id: string;
  avatar?: string;
  createdAt: string;
  fullName?: string;
  username?: string;
  isOnline?: boolean;
  lastSeenAt?: string | null;
}

interface CurrentUser extends User {
  email: string;
  isActive: boolean;
  updatedAt: string;
  hasPassword: boolean;
  phoneNumber?: string;
  hasGoogleAuth: boolean;
  isEmailVerified: boolean;
}

interface CurrentUserContextType {
  currentUser: null | CurrentUser;
}

export type { User, CurrentUser, CurrentUserContextType };
