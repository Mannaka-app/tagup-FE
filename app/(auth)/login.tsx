import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const handleKakaoLogin = () => {
    // TODO: 실제 카카오 로그인 로직 구현
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 justify-center px-6'>
        <Text className='text-2xl font-bold mb-8 text-center'>로그인</Text>

        <View className='space-y-4'>
          <TouchableOpacity
            onPress={handleKakaoLogin}
            className='bg-[#FEE500] rounded-lg p-4 flex-row items-center justify-center'
          >
            <Ionicons
              name='chatbubble'
              size={20}
              color='#000000'
              style={{ marginRight: 8 }}
            />
            <Text className='text-black text-center font-semibold'>
              카카오로 시작하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
