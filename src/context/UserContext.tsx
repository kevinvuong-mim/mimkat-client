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
import { User, UserContextType } from "@/types/user";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user data on mount (fetch from API using localStorage tokens)
  useEffect(() => {
    (async () => {
      try {
        const accessToken = Token.getAccessToken();

        if (!accessToken) {
          return;
        }

        // Use apiClient - it will auto handle token refresh via interceptor
        // Interceptor returns response.data, so we get GetUserResponse directly
        const getUserResponse = await apiClient.get("/users/me");
        const userData = getUserResponse.data; // Get User from GetUserResponse.data
        setUser(userData);
      } catch (error) {
        console.error("Error loading user data:", error);
        // If error (token invalid, etc), clear tokens
        Token.clear();
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
