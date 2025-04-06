import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';

const WINDOW_WIDTH = Dimensions.get('window').width;
const POST_WIDTH = WINDOW_WIDTH;

// 임시 데이터
const DUMMY_POSTS = [
  {
    id: 1,
    user: {
      nickname: '야구팬',
      profileImage: 'https://via.placeholder.com/150',
    },
    image: 'https://via.placeholder.com/500',
    likes: 128,
    content: '오늘 경기 너무 재미있었어요! 👍⚾',
    comments: 24,
    createdAt: '1시간 전',
  },
  {
    id: 2,
    user: {
      nickname: '베이스볼러',
      profileImage: 'https://via.placeholder.com/150',
    },
    image: 'https://via.placeholder.com/500',
    likes: 256,
    content: '멋진 경기였습니다 🔥',
    comments: 32,
    createdAt: '2시간 전',
  },
];

export default function FeedScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {/* 헤더 */}
      <View className='flex-row items-center justify-between px-4 py-2 border-b border-gray-200'>
        <Text className='text-xl font-logo'>tagup</Text>
        <TouchableOpacity>
          <Ionicons name='add-circle-outline' size={24} color='black' />
        </TouchableOpacity>
      </View>

      {/* 피드 목록 */}
      <ScrollView className='flex-1'>
        {DUMMY_POSTS.map((post) => (
          <View key={post.id} className='mb-6'>
            {/* 게시물 헤더 */}
            <View className='flex-row items-center px-4 py-2'>
              <Image
                source={{ uri: post.user.profileImage }}
                className='w-8 h-8 rounded-full'
              />
              <Text className='ml-2 font-medium'>{post.user.nickname}</Text>
            </View>

            {/* 게시물 이미지 */}
            <Image
              source={{ uri: post.image }}
              style={{ width: POST_WIDTH, height: POST_WIDTH }}
              className='bg-gray-100'
            />

            {/* 게시물 액션 버튼 */}
            <View className='flex-row items-center gap-[10px] py-2'>
              <View className='flex-row items-center'>
                <TouchableOpacity className=''>
                  <Ionicons name='heart-outline' size={24} color='black' />
                </TouchableOpacity>
                <Text className='text-black text-sm'>{post.likes}</Text>
              </View>
              <View className='flex-row items-center'>
                <TouchableOpacity className=''>
                  <Ionicons name='chatbubble-outline' size={24} color='black' />
                </TouchableOpacity>
                <Text className='text-black text-sm'>{post.comments}</Text>
              </View>
            </View>

            {/* 좋아요 수 */}
            <Text className='font-medium'>좋아요 {post.likes}개</Text>

            {/* 게시물 내용 */}
            <View className='py-2'>
              <Text>
                <Text className='font-medium'>{post.user.nickname}</Text>{' '}
                {post.content}
              </Text>
              <Text className='text-gray-500 text-sm mt-1'>
                댓글 {post.comments}개 모두 보기
              </Text>
              <Text className='text-gray-400 text-xs mt-1'>
                {post.createdAt}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
