import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  checkAuth: async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    set({ isAuthenticated: !!accessToken });
  },
}));
