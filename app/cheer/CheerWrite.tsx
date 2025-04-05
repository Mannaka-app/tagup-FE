import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';

export default function CheerWrite() {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // TODO: 실제 게시물 등록 로직 구현
    router.back();
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* 헤더 */}
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-200'>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className='text-red-500'>취소</Text>
        </TouchableOpacity>
        <Text className='font-medium text-lg'>응원</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={!content.trim()}>
          <Text
            style={{
              color: content.trim() ? user?.teams?.color : '#9CA3AF',
            }}
          >
            게시
          </Text>
        </TouchableOpacity>
      </View>

      {/* 입력창 */}
      <View className='p-4 flex-1'>
        <TextInput
          placeholder='응원을 작성해주세요'
          placeholderTextColor='#9CA3AF' // Tailwind의 text-gray-400
          className='text-[14px] text-gray-900'
        />
      </View>
    </SafeAreaView>
  );
}
