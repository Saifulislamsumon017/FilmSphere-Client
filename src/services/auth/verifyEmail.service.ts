/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import { IVerifyEmailResponse } from '@/types/auth.types';
import {
  IVerifyEmailPayload,
  verifyEmailZodSchema,
} from '@/zod/auth.validation';

export const verifyEmailService = async (
  payload: IVerifyEmailPayload,
): Promise<IVerifyEmailResponse | ApiErrorResponse> => {
  // 🔥 Validate input
  const parsed = verifyEmailZodSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues?.[0]?.message || 'Invalid input',
    };
  }

  // 🔥 normalize payload
  const safePayload = {
    email: parsed.data.email.trim().toLowerCase(),
    otp: String(parsed.data.otp).trim(),
  };

  try {
    // 🔥 TYPE SAFE API CALL
    const response = await httpClient.post<IVerifyEmailResponse>(
      '/auth/verify-email',
      safePayload,
    );

    const data = response.data;

    console.log('VERIFY EMAIL RESPONSE:', data);

    // 🔥 SAFE SUCCESS CHECK (robust)
    const isSuccess =
      data?.success === true || data?.message === 'Email verified successfully';

    if (!isSuccess) {
      return {
        success: false,
        message: data?.message || 'Verification failed',
      };
    }

    return {
      success: true,
      message: data?.message || 'Email verified successfully',
      data: data?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Verification failed',
    };
  }
};
