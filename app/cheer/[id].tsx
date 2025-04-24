import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSocket } from '@/hooks/useSocket';
import { useImageUpload } from '@/hooks/useChat';
import { useCheer } from '@/hooks/useCheer';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

interface Message {
  id: number;
  userId: number;
  nickname: string;
  profileUrl: string | null;
  userLevel?: number;
  content: string;
  createdAt: string;
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: cheerRoomData, isLoading } = useCheer(Number(id));
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { socket, emit, on } = useSocket();
  const flatListRef = React.useRef<FlatList>(null);
  const imageUploadMutation = useImageUpload();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // 채팅방 참여
    emit('joinCheerRoom', { roomId: Number(id) });

    // 채팅방 입장 시 이전 데이터 수신
    on('cheerRoomJoined', (data: { messages: Message[] }) => {
      console.log('이전 메시지:', data);
      if (data.messages) {
        setMessages(data.messages);
        // 메시지가 설정된 후 스크롤
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      }
    });

    // 새로운 메시지 수신
    on('message', (newMessage: Message) => {
      console.log('새로운 메시지:', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      // 새로운 메시지가 추가된 후 스크롤
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      // 채팅방 나가기
      emit('leaveCheerRoom', { roomId: Number(id) });

      socket.off('message');
      socket.off('cheerRoomJoined');
    };
  }, [socket, id]);

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    emit('message', {
      roomId: Number(id),
      content: message,
    });

    setMessage('');
  };

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('알림', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.1,
      });

      if (!result.canceled) {
        setPreviewImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('이미지 선택 실패:', error);
      Alert.alert('오류', '이미지 선택에 실패했습니다.');
    }
  };

  const handleSendImage = async () => {
    if (!previewImage) return;

    try {
      setIsUploading(true);

      // 이미지 압축
      const compressedImage = await ImageManipulator.manipulateAsync(
        previewImage,
        [{ resize: { width: 800 } }],
        { compress: 0.1, format: ImageManipulator.SaveFormat.WEBP }
      );

      const formData = new FormData();
      formData.append('file', {
        uri: compressedImage.uri,
        type: 'image/webp',
        name: 'image.webp',
      } as any);

      const response = await imageUploadMutation.mutateAsync(formData);

      if (response.success) {
        emit('message', {
          roomId: Number(id),
          content: response.imageUrl,
          type: 'image',
        });
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Alert.alert('오류', '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelImage = () => {
    setPreviewImage(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1'>
        <View className='flex-row items-center py-4 px-5 border-b border-gray-200'>
          <TouchableOpacity onPress={handleBack} className='p-2'>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          <Text className='text-lg font-medium ml-2'>
            {cheerRoomData?.cheerRoom?.title}
          </Text>
        </View>

        <View className='flex-1 '>
          <Image
            source={{ uri: cheerRoomData?.cheerRoom?.thumnailUrl }}
            className='absolute w-[200px] h-[200px] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-7'
            resizeMode='contain'
          />
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                className={`flex-row items-end px-4 py-2 ${
                  item.userId === 20 ? 'justify-end' : 'justify-start'
                }`}
              >
                {item.userId !== 20 && (
                  <Image
                    source={{
                      uri:
                        item.profileUrl ||
                        'https://tagup-images.s3.ap-northeast-2.amazonaws.com/profile/default_profile.png',
                    }}
                    className='w-8 h-8 rounded-full mr-2'
                  />
                )}
                <View
                  className={`max-w-[80%] ${
                    item.userId === 20 ? 'bg-blue-500' : 'bg-gray-100'
                  } rounded-2xl px-4 py-2`}
                >
                  {item.content.includes('https://') &&
                  item.content.match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                    <Image
                      source={{ uri: item.content }}
                      className='w-48 h-48 rounded-lg'
                      resizeMode='cover'
                    />
                  ) : (
                    <>
                      {item.userId !== 20 && (
                        <Text className='text-xs text-gray-500 mb-1'>
                          {item.nickname}
                        </Text>
                      )}
                      <Text
                        className={`${
                          item.userId === 20 ? 'text-white' : 'text-black'
                        }`}
                      >
                        {item.content}
                      </Text>
                    </>
                  )}
                  <Text
                    className={`text-xs mt-1 ${
                      item.userId === 20 ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <View className='flex-row items-center px-4 py-3 border-t border-gray-200'>
            {previewImage ? (
              <View className='flex-1 flex-row items-center bg-gray-100 rounded-full px-2 py-1'>
                <Image
                  source={{ uri: previewImage }}
                  className='w-8 h-8 rounded-md'
                  resizeMode='cover'
                />
                <View className='flex-row flex-1 justify-end'>
                  <TouchableOpacity onPress={handleCancelImage} className='p-2'>
                    <Ionicons name='close-circle' size={20} color='gray' />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSendImage}
                    className='bg-blue-500 rounded-full px-4 py-2 ml-2'
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <ActivityIndicator size='small' color='white' />
                    ) : (
                      <Text className='text-white'>전송</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  className='bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-2'
                  onPress={handleImageUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size='small' color='#0000ff' />
                  ) : (
                    <Ionicons name='image-outline' size={20} color='black' />
                  )}
                </TouchableOpacity>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder='메시지를 입력하세요'
                  className='flex-1 bg-gray-100 px-4 py-3 rounded-full'
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  className='bg-blue-500 w-10 h-10 rounded-full items-center justify-center ml-2'
                >
                  <Ionicons name='send' size={20} color='white' />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
