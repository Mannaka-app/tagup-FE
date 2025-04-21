import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMyChatRooms } from '@/hooks/useChat';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const { data: chatRooms, isLoading, refetchMyChatRooms } = useMyChatRooms();

  useFocusEffect(
    React.useCallback(() => {
      refetchMyChatRooms();
    }, [])
  );

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
        <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-200'>
          <Text className='text-xl font-bold'>메시지</Text>
          <TouchableOpacity>
            <Ionicons name='create-outline' size={24} color='black' />
          </TouchableOpacity>
        </View>

        <FlatList
          data={chatRooms}
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
      </View>
    </SafeAreaView>
  );
}
