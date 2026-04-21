/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import {
  forgetPasswordZodSchema,
  IForgetPasswordPayload,
} from '@/zod/auth.validation';

export interface IForgetPasswordResponse {
  success: boolean;
  message: string;
}

export const forgetPasswordService = async (
  payload: IForgetPasswordPayload,
): Promise<IForgetPasswordResponse | ApiErrorResponse> => {
  const parsed = forgetPasswordZodSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues?.[0]?.message || 'Invalid email',
    };
  }

  try {
    const response = await httpClient.post<IForgetPasswordResponse>(
      '/auth/forget-password',
      {
        email: parsed.data.email.trim().toLowerCase(),
      },
    );

    return {
      success: response.success,
      message: response.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send OTP',
    };
  }
};
