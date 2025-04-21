import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const axiosInstance = axios.create({
  baseURL: 'https://api.yeol.store',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const refreshAccessToken = async (): Promise<string> => {
  const userId = useAuthStore.getState().user?.id;
  const refreshToken = await SecureStore.getItemAsync('refreshToken');

  if (!userId || !refreshToken) {
    throw new Error('토큰 정보가 없습니다.');
  }

  const response = await axios.post('https://api.yeol.store/auth/refresh', {
    userId: userId,
    refreshToken: refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;

  // SecureStore에 저장
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', newRefreshToken);

  // Zustand store 업데이트
  useAuthStore.setState((state) => ({
    ...state,
    accessToken,
    refreshToken: newRefreshToken,
  }));

  return accessToken;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userId');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
