import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Types
interface User {
  name: string;
  seed: string;
}

interface Post {
  id: number;
  user: User;
  content: string;
  likeCount: number;
  time: string;
}

// Constants
const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    user: { name: '동현', seed: 'donghyun' },
    content: '키움 개못하네...',
    likeCount: 2,
    time: '방금 전',
  },
  {
    id: 2,
    user: { name: 'SunyJun', seed: 'sunyjun' },
    content: '오사카에서 현지인들이 가는 음식점 알려주세요 @!',
    likeCount: 0,
    time: '방금 전',
  },
  {
    id: 3,
    user: {
      name: '미냥_○.○',
      seed: 'minyang',
    },
    content: '나 자야돼!',
    likeCount: 0,
    time: '방금 전',
  },
  {
    id: 4,
    user: {
      name: '미냥_○.○',
      seed: 'minyang',
    },
    content: '나 자야돼!',
    likeCount: 0,
    time: '방금 전',
  },
  {
    id: 5,
    user: {
      name: '미냥_○.○',
      seed: 'minyang',
    },
    content: '나 자야돼!',
    likeCount: 0,
    time: '방금 전',
  },
  {
    id: 6,
    user: {
      name: '미냥_○.○',
      seed: 'minyang',
    },
    content: '나 자야돼!',
    likeCount: 0,
    time: '방금 전',
  },
  {
    id: 7,
    user: {
      name: '미냥_○.○',
      seed: 'minyang',
    },
    content: '나 자야돼!',
    likeCount: 0,
    time: '방금 전',
  },
];

const getAvatarUrl = (seed: string) =>
  encodeURI(
    `https://api.dicebear.com/7.x/lorelei/png?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=64`
  );

export default function Cheer() {
  const { user } = useAuthStore();
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
        {DUMMY_POSTS.map((post) => (
          <View key={post.id} className='border-b border-gray-200'>
            <View className='flex flex-col px-5 py-4 gap-[20px]'>
              <View className='flex-row items-center gap-[10px]'>
                <Image
                  source={{ uri: getAvatarUrl(post.user.seed) }}
                  className='w-10 h-10 rounded-full bg-gray-100'
                />
                <View className='flex flex-col gap-[5px]'>
                  <Text className='font-regular text-sm'>{post.user.name}</Text>
                  <Text className='font-light text-gray-500 text-xs'>
                    {post.time}
                  </Text>
                </View>
              </View>
              <View>
                <Text className='text-sm font-light'>{post.content}</Text>
              </View>
              <View className='flex flex-row items-center'>
                <View className='flex flex-row items-center gap-[3px]'>
                  <TouchableOpacity onPress={() => handleLike(post.id)}>
                    <Ionicons
                      name={
                        likedPosts.includes(post.id) ? 'heart' : 'heart-outline'
                      }
                      size={14}
                      color={
                        likedPosts.includes(post.id)
                          ? user?.teams?.color
                          : '#6B7280'
                      }
                    />
                  </TouchableOpacity>
                  <Text className='text-gray-500 font-light text-sm'>
                    {post.likeCount + (likedPosts.includes(post.id) ? 1 : 0)}
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
