'use client';

import { useQuery } from '@tanstack/react-query';
import { ReactNode, useContext, createContext } from 'react';

import { isPublicRoute } from '@/lib/public-route';
import { CurrentUserContextType } from '@/types/user';
import { usersService } from '@/services/users.service';

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { data: currentUser } = useQuery({
    queryKey: ['getMe'],
    queryFn: usersService.getMe,
    enabled: () => {
      if (typeof window === 'undefined') return false;

      return !isPublicRoute(window.location.pathname);
    },
  });

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>{children}</CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) throw new Error('useCurrentUser must be used within CurrentUserProvider');

  return context;
}
