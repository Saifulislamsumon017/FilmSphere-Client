/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { setTokenInCookies } from '@/lib/tokenUtils';

import { ApiErrorResponse } from '@/types/api.types';
import { IRegisterResponse } from '@/types/auth.types';
import { IRegisterPayload, registerUserZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const registerService = async (
  payload: IRegisterPayload,
): Promise<IRegisterResponse | ApiErrorResponse> => {
  // ✅ Zod validation
  const parsed = registerUserZodSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  try {
    // ✅ API call
    const res = await httpClient.post<IRegisterResponse>(
      '/auth/register',
      parsed.data,
    );

    const { accessToken, refreshToken, token, user } = res.data;

    // ✅ cookies set (same pattern as login)
    await setTokenInCookies('accessToken', accessToken);
    await setTokenInCookies('refreshToken', refreshToken);
    await setTokenInCookies('better-auth.session_token', token, 86400);

    // ✅ redirect logic
    if (!user.emailVerified) {
      redirect(`/verify-email?email=${user.email}`);
    }

    redirect('/dashboard');
  } catch (error: any) {
    // Next redirect ignore
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;

    return {
      success: false,
      message: error?.response?.data?.message || 'Register failed',
    };
  }
};
