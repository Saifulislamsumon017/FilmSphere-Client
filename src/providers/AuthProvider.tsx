'use client';

import { IUser } from '@/types/auth.types';
import { createContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo } from '@/services/auth/getusers.services';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isFetching: boolean;
  setUser: (user: IUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    data: fetchedUser,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getUserInfo,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const user = fetchedUser ?? null;

  // ✅ SAFE setter
  const setUser = (value: IUser | null) => {
    queryClient.setQueryData(['user', 'me'], value);
  };

  const userInfo = { user, isLoading, isFetching, setUser };

  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
