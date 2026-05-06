/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import { cookies } from 'next/headers';

export const logoutService = async (): Promise<
  ApiResponse<null> | ApiErrorResponse
> => {
  try {
    const response = await httpClient.post<null>('/auth/logout', {});

    const cookieStore = await cookies();

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('better-auth.session_token');

    return response;
  } catch (error: any) {
    console.error('Logout failed:', error);
    return {
      success: false,
      message: 'Logout failed',
    };
  }
};

/* 'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const logoutService = async () => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken ?? ''}; refreshToken=${refreshToken ?? ''}`,
      },
      cache: 'no-store',
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('better-auth.session_token');

    redirect('/login');
  } catch (error) {
    console.error('Logout failed:', error);

    const cookieStore = await cookies();

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('better-auth.session_token');

    redirect('/login');
  }
};
 */
