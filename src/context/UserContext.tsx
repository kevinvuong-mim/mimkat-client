"use client";

import { createContext, useContext, ReactNode } from "react";
import { isPublicRoute } from "@/lib/utils";
import { UserContextType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user } = useQuery({
    queryKey: ["getProfile"],
    queryFn: userService.getProfile,
    enabled: () => {
      if (typeof window === "undefined") return false;

      return !isPublicRoute(window.location.pathname);
    },
  });

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
