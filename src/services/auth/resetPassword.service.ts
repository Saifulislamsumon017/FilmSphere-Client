/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import { IResetPasswordResponse } from '@/types/auth.types';
import {
  IResetPasswordPayload,
  resetPasswordZodSchema,
} from '@/zod/auth.validation';

export const resetPasswordService = async (
  payload: IResetPasswordPayload,
): Promise<IResetPasswordResponse | ApiErrorResponse> => {
  const parsed = resetPasswordZodSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues?.[0]?.message || 'Invalid input',
    };
  }

  try {
    const { data } = await httpClient.post<IResetPasswordResponse>(
      '/auth/reset-password',
      {
        email: parsed.data.email.trim().toLowerCase(),
        otp: parsed.data.otp.trim(),
        newPassword: parsed.data.newPassword.trim(),
      },
    );

    return {
      success: true,
      message: data?.message ?? 'Password reset successful',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || error?.message || 'Reset failed',
    };
  }
};
