'use server';

import { setTokenInCookies } from '@/lib/tokenUtils';
import { cookies } from 'next/headers';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    const { data } = await res.json();

    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) {
      await setTokenInCookies('accessToken', accessToken);
    }

    if (newRefreshToken) {
      await setTokenInCookies('refreshToken', newRefreshToken);
    }

    if (token) {
      await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60); // 1 day in seconds
    }

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

export const getUserInfo = async () => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const sessionToken = cookieStore.get('better-auth.session_token')?.value;

    // token না থাকলে user logged in না
    if (!accessToken && !sessionToken) {
      return null;
    }

    const cookieParts = [];

    if (accessToken) {
      cookieParts.push(`accessToken=${accessToken}`);
    }

    if (sessionToken) {
      cookieParts.push(`better-auth.session_token=${sessionToken}`);
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: cookieParts.join('; '),
      },
      cache: 'no-store',
    });

    // unauthorized / invalid token
    if (res.status === 401 || res.status === 403) {
      return null;
    }

    // server error
    if (!res.ok) {
      return null;
    }

    const result = await res.json();

    return result?.data ?? null;
  } catch {
    return null;
  }
};
