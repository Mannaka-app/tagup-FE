import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import { useEffect, useState } from 'react';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useFonts } from 'expo-font';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { accessToken, restoreAuth } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  // 폰트 로드
  const [fontsLoaded] = useFonts({
    Pretendard: require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Thin': require('@/assets/fonts/Pretendard-Thin.otf'),
    'Pretendard-ExtraLight': require('@/assets/fonts/Pretendard-ExtraLight.otf'),
    'Pretendard-Light': require('@/assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('@/assets/fonts/Pretendard-ExtraBold.otf'),
    'Pretendard-Black': require('@/assets/fonts/Pretendard-Black.otf'),
    ITCAvantGarde: require('@/assets/fonts/ITC Avant Garde Gothic LT Book.ttf'),
  });

  useEffect(() => {
    (async () => {
      await restoreAuth();
      setAuthChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (!navigationState?.key || !authChecked) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!accessToken && !inAuthGroup) {
      router.replace('/login');
    }
  }, [segments, navigationState?.key, accessToken, authChecked]);

  if (!fontsLoaded || !authChecked) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </QueryClientProvider>
  );
}
