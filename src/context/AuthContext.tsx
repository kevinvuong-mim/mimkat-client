"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Token } from "@/lib/token";
import { apiClient } from "@/lib/api";

interface User {
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
        const accessToken = Token.getAccessToken();

        if (!accessToken) {
          return;
        }

        // Use apiClient - it will auto handle token refresh via interceptor
        const response = await apiClient.get<User>("/users/me");
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        // If error (token invalid, etc), clear tokens
        Token.clear();
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
