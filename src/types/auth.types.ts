import { UserRole } from '@/lib/authUtils';

export type UserStatus = 'ACTIVE' | 'BANNED' | 'SUSPENDED' | 'DELETED';

export interface IUser {
  name: string;
  email: string;
  emailVerified: boolean;
  needPasswordChange?: boolean;
  image?: string;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
}

export interface IRegisterResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  user: IUser;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  user: IUser;
}

// export interface ILoginResponse {
//   success: true;
//   message: string;
//   user: IUser;
//   accessToken: string;
//   refreshToken: string;
//   token: string;
// }

export interface IVerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
    otp?: string;
  };
}

export interface IForgetPasswordResponse {
  success: boolean;
  message: string;
}

export interface IResetPasswordResponse {
  success: boolean;
  message: string;
  // email: string;
  // otp: string;
  // newPassword: string;
}
