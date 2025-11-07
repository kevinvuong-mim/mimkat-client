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
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setAuthData: (data: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Clear invalid data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Auto refresh token before it expires
  useEffect(() => {
    if (!accessToken) return;

    // Refresh token every 50 minutes (access token expires in 1 hour)
    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  /**
   * Set authentication data (user, tokens) and save to localStorage
   */
  const setAuthData = useCallback((data: AuthResponse) => {
    setAccessToken(data.accessToken);
    setUser(data.user);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setAuthData(response);
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
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken && accessToken) {
        await authService.logout({ refreshToken }, accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setAccessToken(null);

      // Redirect to login page
      router.push("/auth");
    }
  };

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authService.refreshToken({ refreshToken });
      setAuthData(response);
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, logout user
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        register,
        logout,
        refreshAccessToken,
        setAuthData,
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
