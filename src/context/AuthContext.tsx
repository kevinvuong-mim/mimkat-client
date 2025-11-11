"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TokenStorage } from "@/lib/token-storage";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  fullName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user data on mount (fetch from API using localStorage tokens)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = TokenStorage.getAccessToken();

        if (!accessToken) {
          return;
        }

        // Use apiClient - it will auto handle token refresh via interceptor
        const response = await apiClient.get<User>("/auth/me");
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        // If error (token invalid, etc), clear tokens
        TokenStorage.clearTokens();
      }
    };

    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
