import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useCreateFeed, useUploadFeedImage } from '@/hooks/useFeed';

export default function CreateFeedScreen() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { mutate: createFeed, isPending } = useCreateFeed();
  const { mutate: uploadImage } = useUploadFeedImage();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.1,
        aspect: [1, 1],
      });

      if (result.canceled) {
        return;
      }

      const localUri = result.assets[0].uri;
      console.log('선택된 이미지 URI:', localUri);

      const manipResult = await ImageManipulator.manipulateAsync(localUri, [], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.WEBP,
      });
      const compressedUri = manipResult.uri;
      console.log('압축된 이미지 URI:', compressedUri);

      const filename = compressedUri.split('/').pop() || 'feed.webp';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      console.log('파일 정보:', { filename, type });

      const formData = new FormData();
      formData.append('file', {
        uri: compressedUri,
        name: filename,
        type,
      } as any);
      console.log('생성된 FormData:', formData);

      console.log('이미지 업로드 시작...');
      setUploading(true);
      const uploadResponse = await uploadImage(formData);
      console.log('이미지 업로드 응답:', uploadResponse);

      uploadImage(formData, {
        onSuccess: (response) => {
          if (response.success) {
            setImages([...images, response.imageUrl]);
          } else {
            Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다.');
          }
        },
        onError: (error) => {
          console.error('이미지 업로드 중 오류:', error);
          Alert.alert('오류', '이미지 업로드 중 오류가 발생했습니다.');
        },
        onSettled: () => {
          setUploading(false);
        },
      });
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      Alert.alert('오류', '이미지 업로드 중 오류가 발생했습니다.');
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    if (images.length === 0) {
      Alert.alert('알림', '이미지를 최소 1개 이상 추가해주세요.');
      return;
    }

    try {
      await createFeed(
        { content, imageUrls: images },
        {
          onSuccess: () => {
            router.back();
          },
          onError: (error) => {
            Alert.alert('오류', '피드 작성 중 오류가 발생했습니다.');
            console.error(error);
          },
        }
      );
    } catch (error) {
      console.error('피드 작성 중 오류:', error);
      Alert.alert('오류', '피드 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {/* 헤더 */}
      <View className='flex-row items-center justify-between px-5 py-3 border-b border-gray-200'>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='close' size={24} color='black' />
        </TouchableOpacity>
        <Text className='text-lg font-medium'>새 게시물</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isPending}
          className='bg-blue-500 px-4 py-2 rounded-full'
        >
          <Text className='text-white font-medium'>공유</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1'>
        {/* 내용 입력 */}
        <View className='p-5'>
          <TextInput
            className='text-base'
            placeholder='내용을 입력하세요...'
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        {/* 이미지 미리보기 */}
        <View className='flex-row flex-wrap px-5'>
          {images.map((uri, index) => (
            <View key={index} className='w-1/3 p-1'>
              <Image
                source={{ uri }}
                className='w-full aspect-square rounded-lg'
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 이미지 추가 버튼 */}
      <TouchableOpacity
        onPress={pickImage}
        disabled={uploading}
        className='absolute bottom-5 right-5 bg-blue-500 p-4 rounded-full'
      >
        {uploading ? (
          <ActivityIndicator color='white' />
        ) : (
          <Ionicons name='camera' size={24} color='white' />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
