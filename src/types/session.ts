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

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}
