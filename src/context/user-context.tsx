"use client";

import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext, createContext } from "react";

import { UserContextType } from "@/types/user";
import { isPublicRoute } from "@/lib/public-route";
import { usersService } from "@/services/users.service";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user } = useQuery({
    queryKey: ["getProfile"],
    queryFn: usersService.getProfile,
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

  if (!context) throw new Error("useUser must be used within UserProvider");

  return context;
}
