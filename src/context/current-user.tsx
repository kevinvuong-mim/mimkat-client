'use client';

import { useQuery } from '@tanstack/react-query';
import { ReactNode, useContext, createContext } from 'react';

import { getMe } from '@/services/users';
import { CurrentUserContextType } from '@/types/user';

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { isLoading, data: currentUser } = useQuery({
    queryFn: getMe,
    queryKey: ['getMe'],
  });

  if (isLoading || !currentUser) return null;

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>{children}</CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) throw new Error('useCurrentUser must be used within CurrentUserProvider');

  return context;
}
