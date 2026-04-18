import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse } from '@/types/api.types';
import { IRegisterResponse } from '@/types/auth.types';

import { IRegisterPayload, registerUserZodSchema } from '@/zod/auth.validation';

export const registerService = async (
  payload: IRegisterPayload,
): Promise<IRegisterResponse | ApiErrorResponse> => {
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

    // 🔥 IMPORTANT FIX: response.data বের করো
    return response.data;
  } catch {
    return {
      success: false,
      message: 'Registration failed',
    };
  }
};
