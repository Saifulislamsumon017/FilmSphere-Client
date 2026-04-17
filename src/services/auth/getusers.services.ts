'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import { IUser } from '@/types/auth.types';

// import { cookies } from 'next/headers';

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// if (!BASE_API_URL) {
//   throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
// }

export const getUserInfo = async (): Promise<IUser | ApiErrorResponse> => {
  try {
    const res = await httpClient.get<IUser>('/auth/me');

    return res.data;
  } catch {
    return {
      success: false,
      message: 'Unauthorized or failed to fetch user',
    };
  }
};

// export const getUserInfo = async () => {
//   try {
//     const cookieStore = await cookies();

//     const accessToken = cookieStore.get('accessToken')?.value;

//     const sessionToken = cookieStore.get('better-auth.session_token')?.value;

//     if (!accessToken) {
//       return null;
//     }

//     const res = await fetch(`${BASE_API_URL}/auth/me`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
//       },
//     });

//     if (!res.ok) {
//       console.error('Failed to fetch user info:', res.status, res.statusText);
//       return null;
//     }

//     const { data } = await res.json();

//     return data;
//   } catch (error) {
//     console.error('Error fetching user info:', error);
//     return null;
//   }
// };
