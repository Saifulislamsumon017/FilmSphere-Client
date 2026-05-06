import { AuthContext } from '@/providers/AuthProvider';
import { use } from 'react';

export const useAuthUser = () => {
  const authInfo = use(AuthContext);

  if (!authInfo) {
    throw new Error('User must be used within a AuthProvider');
  }

  return authInfo;
};
