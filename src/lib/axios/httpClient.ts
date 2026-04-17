import { ApiResponse } from '@/types/api.types';
import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { isTokenExpiringSoon } from '../tokenUtils';
import { getNewTokensWithRefreshToken } from '@/services/auth/refreshToken.services';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined');
}

const tryRefreshToken = async (accessToken: string, refreshToken: string) => {
  if (!(await isTokenExpiringSoon(accessToken))) return;

  const requestHeader = headers();

  if ((await requestHeader).get('x-token-refreshed') === '1') return;

  try {
    await getNewTokensWithRefreshToken(refreshToken);
  } catch (error) {
    console.error('Refresh token error:', error);
  }
};

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  });

  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.get<ApiResponse<TData>>(endpoint, options);
  return response.data;
};

const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.post<ApiResponse<TData>>(
    endpoint,
    data,
    options,
  );
  return response.data;
};

const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.put<ApiResponse<TData>>(
    endpoint,
    data,
    options,
  );
  return response.data;
};

const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.patch<ApiResponse<TData>>(
    endpoint,
    data,
    options,
  );
  return response.data;
};

const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  const instance = await axiosInstance();
  const response = await instance.delete<ApiResponse<TData>>(endpoint, options);
  return response.data;
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
