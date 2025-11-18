import { ApiResponse } from "./api";

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

export interface SessionsResponseData {
  sessions: Session[];
}

export interface SessionsResponse extends ApiResponse<SessionsResponseData> {}
