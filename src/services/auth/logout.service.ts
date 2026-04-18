import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const logoutService = async (): Promise<
  ApiResponse<null> | ApiErrorResponse
> => {
  try {
    const response = await httpClient.post<null>('/auth/logout', {});

    const cookieStore = await cookies();

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('better-auth.session_token');

    if (response.success) {
      redirect('/login');
    }

    return response;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error &&
      'digest' in error &&
      typeof (error as { digest: string }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      message: 'Logout failed',
    };
  }
};
