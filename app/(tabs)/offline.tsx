import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '@/hooks/useSocket';
import { router } from 'expo-router';
import { getChatRooms, ChatRoom } from '@/apis/chat';

export default function OfflineScreen() {
  const [title, setTitle] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const { socket, emit, on } = useSocket();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log('채팅방 목록을 가져오는 중...');
        const chatRooms = await getChatRooms();
        console.log('가져온 채팅방 목록:', chatRooms);
        setRooms(chatRooms);
      } catch (error) {
        console.error('채팅방 목록을 가져오는데 실패했습니다:', error);
        Alert.alert('오류', '채팅방 목록을 가져오는데 실패했습니다.');
      }
    };

    fetchRooms();

    on('roomCreated', (room: ChatRoom) => {
      console.log('새로운 채팅방 생성됨:', room);
      setRooms((prev) => [...prev, room]);
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

    emit('createRoom', { title });
    setTitle('');
  };

  const handleJoinRoom = (roomId: number) => {
    router.push(`/chat/${roomId}`);
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5'>
        <View className='flex-1'>
          <Text className='text-lg font-medium mb-4'>오프라인 채팅</Text>

          <View className='mb-4'>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder='채팅방 제목을 입력하세요'
              className='bg-gray-100 px-4 py-3 rounded-lg'
            />

            <TouchableOpacity
              onPress={handleCreateRoom}
              className='bg-black py-3 rounded-lg mt-2'
            >
              <Text className='text-white text-center font-medium'>
                채팅방 생성
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={rooms}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleJoinRoom(item.id)}
                className='bg-gray-100 p-4 rounded-lg mb-2'
              >
                <Text className='font-medium'>{item.title}</Text>
                <Text className='text-gray-500 text-sm mt-1'>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
