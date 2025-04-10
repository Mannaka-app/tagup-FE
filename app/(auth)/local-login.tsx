// LocalLoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { localLogin } from '@/apis/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '@/hooks/useSocket';

export default function LocalLoginScreen() {
  const { setAuth } = useAuthStore();
  const { connect } = useSocket();
  const [email, setEmail] = useState('test@email.com');
  const [password, setPassword] = useState('1234');

  const handleLogin = async () => {
    try {
      const loginResponse = await localLogin(email, password);

      await setAuth({
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
      });

      // 웹소켓 연결 (useSocket의 useEffect에도 자동 연결이 있지만, 명시적 호출 가능)
      connect();

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
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5'>
        {/* 헤더 */}
        <View className='flex-row items-center mt-2'>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
        </View>

        <View className='flex-1 justify-center items-center -mt-20'>
          <Text className='text-2xl font-bold mb-8'>테스트 계정 로그인</Text>
          <Text className='text-gray-500 mb-8 text-center'>
            이 페이지는 테스트 목적으로만 사용됩니다.{'\n'}
            실제 서비스에서는 카카오 로그인을 이용해주세요.
          </Text>

          <View className='w-full space-y-4 mb-8'>
            <View>
              <Text className='text-sm text-gray-600 mb-2'>이메일</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='이메일을 입력하세요'
                className='bg-gray-100 px-4 py-3 rounded-lg'
                autoCapitalize='none'
                keyboardType='email-address'
              />
            </View>
            <View>
              <Text className='text-sm text-gray-600 mb-2'>비밀번호</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='비밀번호를 입력하세요'
                className='bg-gray-100 px-4 py-3 rounded-lg'
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className='bg-black w-full py-4 rounded-xl'
          >
            <Text className='text-white text-center font-medium'>
              테스트 계정으로 로그인
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
