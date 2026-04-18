import { UserRole } from '@/lib/authUtils';

export type UserStatus = 'ACTIVE' | 'BANNED' | 'SUSPENDED' | 'DELETED';

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
}

export interface IRegisterResponse {
  name: string;
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  user: IUser;
}

export interface IVerifyEmailResponse {
  email: string;
  otp: string;
}

export interface IForgetPasswordResponse {
  email: string;
}

export interface IResetPasswordResponse {
  email: string;
  otp: string;
  newPassword: string;
}
