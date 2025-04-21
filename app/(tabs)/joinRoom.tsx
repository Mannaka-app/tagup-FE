import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '@/hooks/useSocket';
import { router } from 'expo-router';
import { useChatRooms } from '@/hooks/useChat';
import { ChatRoom } from '@/apis/chat';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function JoinRoomScreen() {
  const [title, setTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: rooms = [], isLoading, refetchChatRooms } = useChatRooms();
  const { socket, emit, on } = useSocket();

  useFocusEffect(
    React.useCallback(() => {
      refetchChatRooms();
    }, [])
  );

  useEffect(() => {
    on('roomCreated', (room: ChatRoom) => {
      console.log('새로운 채팅방 생성됨:', room);
      setIsModalVisible(false);
      setTitle('');
      refetchChatRooms();
      router.push(`/chat/${room.id}`);
    });

    return () => {
      socket?.off('roomCreated');
    };
  }, []);

  const handleCreateRoom = () => {
    if (!title.trim()) {
      Alert.alert('오류', '채팅방 제목을 입력해주세요.');
      return;
    }

    emit('createRoom', { title }, (room: ChatRoom) => {
      setIsModalVisible(false);
      setTitle('');
      refetchChatRooms();
      router.push(`/chat/${room.id}`);
    });
  };

  const handleJoinRoom = (roomId: number) => {
    router.push(`/chat/${roomId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-lg font-medium'>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1'>
        {/* 헤더 */}
        <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-200'>
          <Text className='text-xl font-bold'>채팅</Text>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className='bg-black p-2 rounded-full'
          >
            <Ionicons name='add' size={24} color='white' />
          </TouchableOpacity>
        </View>

        {/* 채팅방 목록 */}
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleJoinRoom(item.id)}
              className='flex-row items-center p-4 border-b border-gray-100'
            >
              <View className='w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3'>
                <Text className='text-lg font-bold text-gray-600'>
                  {item.title.charAt(0)}
                </Text>
              </View>
              <View className='flex-1'>
                <View className='flex-row justify-between items-center'>
                  <Text className='font-medium'>{item.title}</Text>
                  <Text className='text-gray-500 text-xs'>
                    {new Date(item.createAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Text className='text-gray-500 text-sm'>
                  {item.members}명 참여 중
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className='flex-1 items-center justify-center mt-10'>
              <Text className='text-gray-500'>생성된 채팅방이 없습니다.</Text>
            </View>
          }
        />

        {/* 채팅방 생성 모달 */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType='fade'
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className='flex-1 bg-black/50 items-center justify-center'>
            <View className='bg-white w-11/12 rounded-xl p-6'>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-lg font-bold'>새 채팅방 만들기</Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  className='p-2'
                >
                  <Ionicons name='close' size={24} color='black' />
                </TouchableOpacity>
              </View>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder='채팅방 제목을 입력하세요'
                className='bg-gray-100 px-4 py-3 rounded-lg mb-4'
              />

              <TouchableOpacity
                onPress={handleCreateRoom}
                className='bg-black py-3 rounded-lg'
              >
                <Text className='text-white text-center font-medium'>
                  만들기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
