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

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  user: IUser;
}
