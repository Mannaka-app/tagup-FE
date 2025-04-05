import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type CheerTalk } from '@/apis/cheer';
import { useCheers } from '@/hooks/useCheer';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

export default function Cheer() {
  const { user } = useAuthStore();
  const { data: cheerTalks = [] } = useCheers();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <View className='flex-1 bg-white'>
      <ScrollView className='flex-1'>
        {cheerTalks.map((cheerTalk) => (
          <View key={cheerTalk.id} className='border-b border-gray-200'>
            <View className='flex flex-col px-5 py-4 gap-[20px]'>
              <View className='flex-row items-center gap-[10px]'>
                <Image
                  source={{ uri: cheerTalk.profileUrl }}
                  className='w-10 h-10 rounded-full bg-gray-100'
                />
                <View className='flex flex-col gap-[5px]'>
                  <Text className='font-regular text-sm'>
                    {cheerTalk.nickname}
                  </Text>
                  <Text className='font-light text-gray-500 text-xs'>
                    {formatTime(cheerTalk.createdAt)}
                  </Text>
                </View>
              </View>
              <View>
                <Text className='text-sm font-light'>{cheerTalk.content}</Text>
              </View>
              <View className='flex flex-row items-center'>
                <View className='flex flex-row items-center gap-[3px]'>
                  <TouchableOpacity onPress={() => handleLike(cheerTalk.id)}>
                    <Ionicons
                      name={
                        likedPosts.includes(cheerTalk.id)
                          ? 'heart'
                          : 'heart-outline'
                      }
                      size={14}
                      color={
                        likedPosts.includes(cheerTalk.id)
                          ? user?.teams?.color
                          : '#6B7280'
                      }
                    />
                  </TouchableOpacity>
                  <Text className='text-gray-500 font-light text-sm'>
                    {cheerTalk.likes +
                      (likedPosts.includes(cheerTalk.id) ? 1 : 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className='absolute z-50 bottom-0 right-0 left-0 p-4 bg-transparent'>
        <TouchableOpacity
          onPress={() => router.push('/cheer/CheerWrite')}
          className='self-end px-4 py-3 rounded-full'
          style={{ backgroundColor: user?.teams?.color }}
        >
          <Text className='text-white font-medium text-base'>+ 응원</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
