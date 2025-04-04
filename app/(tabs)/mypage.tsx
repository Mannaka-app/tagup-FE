import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';

import { router } from 'expo-router';
import { logout, unlink } from '@react-native-kakao/user';
import { Ionicons } from '@expo/vector-icons';

export default function MyPageScreen() {
  const { clearAuth, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      // await logout();
      await clearAuth();
      router.replace('/login');
    } catch (error) {
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  const handleUnlink = async () => {
    Alert.alert('회원 탈퇴', '정말로 탈퇴하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          try {
            await unlink(); // 카카오 연동 해제
            await clearAuth(); // 스토어에서 토큰 삭제
            router.replace('/login');
          } catch (error) {
            Alert.alert('탈퇴 실패', '회원 탈퇴 중 오류가 발생했습니다.');
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5'>
        <Text className='text-2xl font-bold mt-8 mb-8'>마이페이지</Text>

        {/* 프로필 이미지 섹션 */}
        <View className='items-center mb-8'>
          <View className='relative'>
            <View className='w-24 h-24 rounded-full bg-gray-200 justify-center items-center overflow-hidden'>
              {/* 기본 프로필 아이콘 또는 사용자 프로필 이미지 */}
              <Ionicons name='person' size={50} color='gray' />
            </View>
            <TouchableOpacity className='absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm'>
              <Ionicons name='camera' size={15} />
            </TouchableOpacity>
          </View>
          <Text className='mt-2 text-lg font-medium'>{user?.nickname}</Text>
        </View>

        <View className='space-y-4'>
          <TouchableOpacity
            onPress={() => router.push('/(edit)/user-edit')}
            className='bg-gray-100 py-4 rounded-lg flex-row items-center px-4'
          >
            <Ionicons name='person-outline' size={24} color='black' />
            <View className='flex-1'>
              <Text className='font-medium text-base text-black ml-3'>
                프로필 수정
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={24} color='gray' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(edit)/team-edit')}
            className='bg-gray-100 py-4 rounded-lg flex-row items-center px-4'
          >
            <Ionicons name='baseball-outline' size={24} color='black' />
            <View className='flex-1'>
              <Text className='font-medium text-base text-black ml-3'>
                응원팀 변경
              </Text>
              <Text className='text-gray-500 ml-3 text-sm'>
                현재 응원팀:{' '}
                {user?.teams
                  ? `${user.teams.name} ${user.teams.emoji}`
                  : '없음'}
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={24} color='gray' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className='bg-gray-100 py-4 rounded-lg flex-row items-center px-4'
          >
            <Ionicons name='log-out-outline' size={24} color='black' />
            <Text className='font-medium text-base text-black ml-3'>
              로그아웃
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUnlink}
            className='bg-red-50 py-4 rounded-lg flex-row items-center px-4'
          >
            <Ionicons name='trash-outline' size={24} color='red' />
            <Text className='font-medium text-base text-red-500 ml-3'>
              회원 탈퇴
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
