import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PermissionScreen() {
  const handlePermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          '권한 필요',
          '갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [
            {
              text: '설정으로 이동',
              onPress: () => {
                // TODO: 설정 앱으로 이동하는 로직 추가
              },
            },
            {
              text: '나중에',
              style: 'cancel',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('권한 요청 중 오류:', error);
      Alert.alert('오류', '권한 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5'>
        <View className='flex-1 justify-center items-center'>
          <View className='w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-6'>
            <Ionicons name='images' size={50} color='gray' />
          </View>
          <Text className='text-2xl font-bold mb-4'>갤러리 접근 권한</Text>
          <Text className='text-gray-600 text-center mb-8'>
            프로필 이미지를 변경하기 위해{'\n'}갤러리 접근 권한이 필요합니다.
          </Text>
          <TouchableOpacity
            onPress={handlePermission}
            className='bg-blue-500 py-4 px-8 rounded-lg'
          >
            <Text className='text-white font-medium'>권한 허용하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
