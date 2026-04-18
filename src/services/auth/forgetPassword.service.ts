import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import { IForgetPasswordResponse } from '@/types/auth.types';
import {
  forgetPasswordZodSchema,
  IForgetPasswordPayload,
} from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export const forgetPasswordService = async (
  payload: IForgetPasswordPayload,
): Promise<IForgetPasswordResponse | ApiErrorResponse> => {
  const parsedPayload = forgetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || 'Invalid input',
    };
  }

  try {
    const response = await httpClient.post<IForgetPasswordResponse>(
      '/auth/forget-password',
      parsedPayload.data,
    );

    if (response.success) {
      redirect(`/reset-password?email=${response.data.email}`);
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
      message: 'Failed to send OTP',
    };
  }
};
