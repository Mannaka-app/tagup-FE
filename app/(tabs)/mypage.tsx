import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyPageScreen() {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 items-center justify-center'>
        <Text className='text-lg font-medium'>마이페이지</Text>
      </View>
    </SafeAreaView>
  );
}
