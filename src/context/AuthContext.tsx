"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { authService, AuthResponse } from "@/services/auth.service";
import { TokenStorage } from "@/lib/token-storage";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user data on mount (fetch from API using localStorage tokens)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = TokenStorage.getAccessToken();

        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        // Use apiClient - it will auto handle token refresh if needed
        const userData = await apiClient.get<User>("/api/v1/auth/me");
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        // If error (token invalid, etc), clear tokens
        TokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Auto refresh token before it expires (every 50 minutes)
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await authService.refreshToken();
      } catch (error) {
        console.error("Token refresh error:", error);
        await logout();
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register new account with email and password
   * Note: User needs to verify email before they can login
   */
  const register = async (email: string, password: string) => {
    try {
      await authService.register({ email, password });
      // Don't automatically log in after registration
      // User needs to verify email first
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout from the system
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
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
