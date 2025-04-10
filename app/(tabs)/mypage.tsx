import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadProfileImage, uploadImage } from '@/apis/mypage';
import { router } from 'expo-router';
import { logout, unlink } from '@react-native-kakao/user';
import { Ionicons } from '@expo/vector-icons';
import { useDeleteProfileImage } from '@/hooks/useDetailUser';
import { useSocket } from '@/hooks/useSocket';

export default function MyPageScreen() {
  const { clearAuth, user, setUser } = useAuthStore();
  const { disconnect } = useSocket();
  const { mutate: deleteProfileImage } = useDeleteProfileImage();

  useEffect(() => {
    console.log('프로필 URL:', user?.profileUrl);
  }, [user?.profileUrl]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.1,
        aspect: [1, 1],
      });

      if (result.canceled) return;

      const localUri = result.assets[0].uri;
      console.log('선택된 이미지 URI:', localUri);

      const manipResult = await ImageManipulator.manipulateAsync(localUri, [], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.WEBP,
      });
      const compressedUri = manipResult.uri;
      console.log('압축된 이미지 URI:', compressedUri);

      const filename = compressedUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      const formData = new FormData();
      formData.append('file', {
        uri: compressedUri,
        name: filename,
        type,
      } as any);

      console.log('이미지 업로드 시작...');
      const uploadResponse = await uploadImage(formData);
      console.log('이미지 업로드 응답:', uploadResponse);

      if (!uploadResponse.success) {
        Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다.');
        return;
      }

      console.log('프로필 이미지 업데이트 시작...');
      const profileResponse = await uploadProfileImage(uploadResponse.imageUrl);
      console.log('프로필 이미지 업데이트 응답:', profileResponse);

      setUser(profileResponse.user);
    } catch (error) {
      console.error('pickImage 오류:', error);
      Alert.alert('오류', '이미지 선택 및 업로드 중 문제가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      // 필요한 경우 카카오 로그아웃 호출
      // await logout();
      disconnect();
      await clearAuth();
      router.replace('/login');
    } catch (error) {
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  const handleUnlink = () => {
    Alert.alert('회원 탈퇴', '정말로 탈퇴하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          try {
            await unlink();
            disconnect();
            await clearAuth();
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
      <View className='flex-1 px-5 mt-8'>
        {/* 프로필 이미지 섹션 */}
        <View className='items-center mb-8'>
          <View className='relative'>
            <View className='w-24 h-24 rounded-full justify-center items-center overflow-hidden'>
              <Image
                source={{ uri: user?.profileUrl as string }}
                className='w-full h-full'
                style={{ resizeMode: 'cover' }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('프로필 이미지', '원하시는 작업을 선택해주세요', [
                  { text: '이미지 변경', onPress: pickImage },
                  {
                    text: '이미지 삭제',
                    onPress: () => deleteProfileImage(),
                    style: 'destructive',
                  },
                  { text: '취소', style: 'cancel' },
                ]);
              }}
              className='absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm'
            >
              <Ionicons name='camera' size={15} />
            </TouchableOpacity>
          </View>
          <Text className='mt-2 text-lg font-medium'>{user?.nickname}</Text>
        </View>

        <View className='space-y-4 gap-y-4'>
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
            onPress={() => router.push('/(auth)/permission')}
            className='bg-gray-100 py-4 rounded-lg flex-row items-center px-4'
          >
            <Ionicons name='settings-outline' size={24} color='black' />
            <View className='flex-1'>
              <Text className='font-medium text-base text-black ml-3'>
                권한 설정
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
