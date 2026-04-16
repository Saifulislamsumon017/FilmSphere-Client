import { z } from 'zod';

export const registerUserZodSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginZodSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailZodSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const forgetPasswordZodSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordZodSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});

export type IRegisterPayload = z.infer<typeof registerUserZodSchema>;
export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
export type IForgetPasswordPayload = z.infer<typeof forgetPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
