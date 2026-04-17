import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import { IRegisterResponse } from '@/types/auth.types';

import { IRegisterPayload, registerUserZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const registerService = async (
  payload: IRegisterPayload,
): Promise<ApiResponse<IRegisterResponse> | ApiErrorResponse> => {
  const parsedPayload = registerUserZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || 'Invalid input',
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      '/auth/register',
      parsedPayload.data,
    );

    const email = response.data.email || parsedPayload.data.email;

    redirect(`/verify-email?email=${email}`);
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
      message: 'Registration failed',
    };
  }
};
