import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import { IResetPasswordResponse } from '@/types/auth.types';
import {
  IResetPasswordPayload,
  resetPasswordZodSchema,
} from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const resetPasswordService = async (
  payload: IResetPasswordPayload,
): Promise<IResetPasswordResponse | ApiErrorResponse> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || 'Invalid input',
    };
  }

  try {
    const response = await httpClient.post<IResetPasswordResponse>(
      '/auth/reset-password',
      parsedPayload.data,
    );

    if (response.success) {
      redirect('/login');
    }

    return response.data;
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
      message: 'Password reset failed',
    };
  }
};
