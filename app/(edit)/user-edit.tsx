import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUpdateUser } from '@/hooks/useDetailUser';

export default function UserEditScreen() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | null>(null);
  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    if (!gender) {
      Alert.alert('알림', '성별을 선택해주세요.');
      return;
    }

    updateUser(
      {
        nickname: nickname.trim(),
        gender,
      },
      {
        onSuccess: () => {
          router.push('/(tabs)/mypage');
        },
        onError: (error) => {
          Alert.alert('오류', '사용자 정보 저장 중 오류가 발생했습니다.');
          console.error(error);
        },
      }
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-4 py-3'>
        <View className='flex-row justify-between items-center mb-8'>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className='text-red-500'>취소</Text>
          </TouchableOpacity>
          <Text className='text-lg font-regular'>프로필</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!nickname.trim() || !gender}
          >
            <Text
              className={`${
                nickname.trim() && gender ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              완료
            </Text>
          </TouchableOpacity>
        </View>

        <View className='space-y-6'>
          <View>
            <Text className='text-base font-medium mb-2'>닉네임</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder='닉네임을 입력해주세요'
              className='bg-gray-100 px-4 py-3 rounded-lg'
              maxLength={10}
            />
          </View>

          <View>
            <Text className='text-base font-medium mb-2'>성별</Text>
            <View className='flex-row space-x-4'>
              <TouchableOpacity
                onPress={() => setGender('MALE')}
                className={`flex-1 py-3 rounded-lg ${
                  gender === 'MALE' ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    gender === 'MALE' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  남성
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGender('FEMALE')}
                className={`flex-1 py-3 rounded-lg ${
                  gender === 'FEMALE' ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    gender === 'FEMALE' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  여성
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
