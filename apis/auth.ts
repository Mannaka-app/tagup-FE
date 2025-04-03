import fetcher from '@/utils/fetcher';
import { axiosInstance } from './@core';
import * as SecureStore from 'expo-secure-store';
export interface UserDetailDto {
  nickname: string;
  gender: 'MALE' | 'FEMALE';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    nickname: string | null;
    gender: string | null;
    teams: {
      id: number;
      name: string;
      color: string;
      emoji: string;
    } | null;
    email: string | null;
    authProvider: string;
    level: number;
    winningRate: number | null;
    createdAt?: string;
    password: string | null;
    profileUrl: string | null;
    sub: string;
    teamSeletedAt?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const setUserDetail = async (
  data: UserDetailDto
): Promise<LoginResponse> => {
  const response = await fetcher<LoginResponse>({
    url: '/users/detail',
    method: 'POST',
    data,
  });
  console.log('유저 디테일 수정 응답:', response.data);
  return response.data;
};

export const kakaoLogin = async (idToken: string): Promise<LoginResponse> => {
  const response = await fetcher<LoginResponse>({
    url: '/auth/kakao/login',
    method: 'POST',
    data: { idToken },
  });
  const { accessToken, refreshToken } = response.data;
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  return response.data;
};

export const localLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetcher<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: {
      email,
      password,
    },
  });
  const { accessToken, refreshToken } = response.data;
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  console.log('로그인 응답:', response.data);
  return response.data;
};
