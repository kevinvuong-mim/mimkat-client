"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import { User, UserContextType } from "@/types/user";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load user data
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const getUserResponse = await apiClient.get("/users/me");
      const userData = getUserResponse.data;
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on mount (using cookies for authentication)
  useEffect(() => {
    (async () => {
      // Don't call API if we're on public pages (user is not authenticated)
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isPublicPage =
          currentPath.startsWith("/auth") ||
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/register") ||
          currentPath.startsWith("/forgot-password") ||
          currentPath.startsWith("/reset-password") ||
          currentPath.startsWith("/verify-email");

        // Exception: change-password requires authentication
        const isProtectedAuthPage = currentPath === "/change-password";

        if (isPublicPage && !isProtectedAuthPage) {
          setIsLoading(false);
          return;
        }
      }

      await loadUserData();
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, loadUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
