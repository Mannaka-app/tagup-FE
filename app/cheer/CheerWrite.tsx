import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import { usePostCheer } from '@/hooks/useCheer';

export default function CheerWrite() {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const { mutate: postCheer, isPending } = usePostCheer();

  const handleSubmit = async () => {
    if (!content.trim() || isPending) return;

    try {
      await postCheer(content.trim());
      router.back();
    } catch (error) {
      console.error('응원글 작성 실패:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* 헤더 */}
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-200'>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className='text-red-500'>취소</Text>
        </TouchableOpacity>
        <Text className='font-medium text-lg'>응원</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!content.trim() || isPending}
        >
          <Text
            style={{
              color:
                content.trim() && !isPending ? user?.teams?.color : '#9CA3AF',
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
          placeholderTextColor='#9CA3AF'
          className='text-[14px] text-gray-900'
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
        />
      </View>
    </SafeAreaView>
  );
}
