import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import { IVerifyEmailResponse } from '@/types/auth.types';

import {
  IVerifyEmailPayload,
  verifyEmailZodSchema,
} from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const verifyEmailService = async (
  payload: IVerifyEmailPayload,
): Promise<ApiResponse<IVerifyEmailResponse> | ApiErrorResponse> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || 'Invalid input',
    };
  }

  try {
    const response = await httpClient.post<IVerifyEmailResponse>(
      '/auth/verify-email',
      parsedPayload.data,
    );

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
      message: 'Email verification failed',
    };
  }
};
