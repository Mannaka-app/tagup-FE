import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: number;
  nickname: string | null;
  gender: string | null;
  teams: {
    id: number;
    name: string;
    emoji: string;
    color: string;
  } | null;
  email: string | null;
  authProvider: string;
  level: number;
  winningRate: number | null;
  createdAt?: string;
  profileUrl?: string | null;
  sub?: string;
  teamSeletedAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  setUser: (user: User) => void;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: async (data) => {
    try {
      const { user, accessToken, refreshToken } = data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      set({
        user: {
          id: user.id,
          nickname: user.nickname,
          gender: user.gender,
          teams: user.teams,
          email: user.email,
          authProvider: user.authProvider,
          level: user.level,
          winningRate: user.winningRate,
          createdAt: user.createdAt,
          profileUrl: user.profileUrl,
          sub: user.sub,
          teamSeletedAt: user.teamSeletedAt,
        },
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error('토큰 저장 중 에러 발생:', err);
    }
  },
  setUser: (user) => {
    set((state) => ({
      ...state,
      user: {
        id: user.id,
        nickname: user.nickname,
        gender: user.gender,
        teams: user.teams,
        email: user.email,
        authProvider: user.authProvider,
        level: user.level,
        winningRate: user.winningRate,
        createdAt: user.createdAt,
        profileUrl: user.profileUrl,
        sub: user.sub,
        teamSeletedAt: user.teamSeletedAt,
      },
    }));
  },
  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    } catch (err) {
      console.error('로그아웃 중 에러 발생:', err);
    }
  },
}));
