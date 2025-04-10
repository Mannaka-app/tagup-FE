import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSocket } from '@/hooks/useSocket';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: number;
  userId: number;
  nickname: string;
  profileUrl: string | null;
  userLevel: number;
  content: string;
  createdAt: string;
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket, emit, on } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // 채팅방 참여
    emit('joinRoom', { roomId: Number(id) });

    // 메시지 수신
    on('message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket, id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    emit('message', {
      roomId: Number(id),
      content: message,
    });

    setMessage('');
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5'>
        <View className='flex-row items-center py-4'>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
          <Text className='text-lg font-medium ml-2'>채팅방</Text>
        </View>

        <View className='flex-1'>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className='bg-gray-100 p-4 rounded-lg mb-2'>
                <View className='flex-row items-center mb-1'>
                  <Text className='font-medium'>{item.nickname}</Text>
                  <Text className='text-gray-500 text-sm ml-2'>
                    Lv.{item.userLevel}
                  </Text>
                </View>
                <Text>{item.content}</Text>
                <Text className='text-gray-500 text-xs mt-1'>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
          />

          <View className='flex-row mt-4'>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder='메시지를 입력하세요'
              className='flex-1 bg-gray-100 px-4 py-3 rounded-lg'
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              className='bg-black px-4 py-3 rounded-lg ml-2'
            >
              <Text className='text-white'>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
