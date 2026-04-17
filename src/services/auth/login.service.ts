import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from '@/lib/authUtils';
import { httpClient } from '@/lib/axios/httpClient';
import { setTokenInCookies } from '@/lib/tokenUtils';
import { ApiErrorResponse } from '@/types/api.types';
import { ILoginResponse } from '@/types/auth.types';
import { ILoginPayload, loginZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const loginService = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsed = loginZodSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  try {
    const res = await httpClient.post<ILoginResponse>(
      '/auth/login',
      parsed.data,
    );

    const { accessToken, refreshToken, token, user } = res.data;
    const { role, emailVerified, email } = user;

    await setTokenInCookies('accessToken', accessToken);
    await setTokenInCookies('refreshToken', refreshToken);
    await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60);

    if (!emailVerified) {
      redirect(`/verify-email?email=${email}`);
    }

    // if (needPasswordChange) {
    //   redirect(`/reset-password?email=${email}`);
    // }

    const target =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    redirect(target);
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
      message: 'Login failed',
    };
  }
};
