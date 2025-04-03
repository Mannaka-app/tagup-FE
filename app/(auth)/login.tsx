import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { login } from '@react-native-kakao/user';
import KakaoSvg from '@/assets/images/kakao.svg';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { kakaoLogin } from '@/apis/auth';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginScreen() {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const kakaoKey = Constants.expoConfig?.extra?.kakaoNativeAppKey;
    if (kakaoKey) {
      initializeKakaoSDK(kakaoKey);
    }
  }, []);

  const handleLogin = async () => {
    try {
      // react-native-kakao 로그인을 통한 카카오 로그인
      const response = await login();

      console.log('로그인 응답:', response);

      // response.idToken을 백엔드에 로그인 요청
      if (!response.idToken) {
        throw new Error('idToken이 없습니다.');
      }
      const loginResponse = await kakaoLogin(response.idToken);
      console.log('백엔드 로그인 응답:', loginResponse);

      // 인증 상태 업데이트
      setAuth({
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
      });

      // 상태 업데이트가 완료될 때까지 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 사용자 정보 상태에 따라 라우팅
      if (loginResponse.user.nickname && loginResponse.user.gender) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    } catch (error) {
      Alert.alert('로그인 실패', '로그인 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <View className='flex-1 justify-center items-center bg-white pt-[200px] gap-[300px]'>
      <View className='flex-col gap-[10px]'>
        <Text className='font-logo text-5xl'>tagup</Text>
        <Text className='font-extralight text-lg'>직관친구가 필요할 땐</Text>
      </View>

      <View className='flex-col gap-[15px]'>
        <TouchableOpacity
          onPress={handleLogin}
          className='bg-[#FFE500] py-[10px] rounded-[50px] flex-row items-center justify-center px-[19px]'
        >
          <KakaoSvg width={16} height={16} />
          <Text className='font-regular text-sm text-black px-[40px]'>
            카카오로 3초만에 시작하기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/local-login')}
          className='bg-gray-100 py-[10px] rounded-[50px] flex-row items-center justify-center px-[19px]'
        >
          <Ionicons name='person-outline' size={16} color='black' />
          <Text className='font-regular text-sm text-black px-[40px]'>
            테스트 계정으로 로그인
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
