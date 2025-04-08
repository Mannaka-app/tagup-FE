import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';
import { useFeed } from '@/hooks/useFeed';
import { router } from 'expo-router';
import FeedCommentModal from '@/app/components/FeedCommentModal';

const WINDOW_WIDTH = Dimensions.get('window').width;
const POST_WIDTH = WINDOW_WIDTH;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else {
    return `${days}일 전`;
  }
};

export default function FeedScreen() {
  const { data: feedData, isLoading } = useFeed();
  const { user } = useAuthStore();
  const [currentImageIndices, setCurrentImageIndices] = useState<{
    [key: number]: number;
  }>({});
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showCommentModal, setShowCommentModal] = useState<number | null>(null);

  const handleImageIndexChange = (feedId: number, index: number) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [feedId]: index,
    }));
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white' edges={['top']}>
        <View className='flex-1 items-center justify-center'>
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {/* 헤더 */}
      <View className='flex-row items-center justify-between px-5 py-3 border-b border-gray-200'>
        <Text className='text-xl font-logo'>tagup</Text>
        <TouchableOpacity onPress={() => router.push('/feed/create')}>
          <Ionicons name='add-circle-outline' size={24} color='black' />
        </TouchableOpacity>
      </View>

      {/* 피드 목록 */}
      <ScrollView className='flex-1'>
        {feedData?.feed.map((feed) => (
          <View key={feed.id} className='border-b border-gray-200'>
            {/* 게시물 헤더 */}
            <View className='flex-row items-center justify-between px-5 py-3'>
              <View className='flex-row items-center flex-1'>
                <Image
                  source={{ uri: feed.profileUrl }}
                  className='w-8 h-8 rounded-full mr-2'
                />
                <View>
                  <Text className='font-medium'>{feed.nickName}</Text>
                  <Text className='text-xs text-gray-500'>
                    {formatDate(feed.createdAt)}
                  </Text>
                </View>
              </View>
              {user?.id === feed.userId && (
                <TouchableOpacity
                  onPress={() =>
                    setShowMenu(showMenu === feed.id ? null : feed.id)
                  }
                >
                  <Ionicons
                    name='ellipsis-horizontal'
                    size={20}
                    color='black'
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* 메뉴 모달 */}
            {showMenu === feed.id && (
              <View className='absolute right-5 top-12 bg-white rounded-lg shadow-lg z-10'>
                <TouchableOpacity
                  className='px-4 py-3'
                  onPress={() => {
                    setShowMenu(null);
                    Alert.alert(
                      '게시물 삭제',
                      '정말로 이 게시물을 삭제하시겠습니까?',
                      [
                        {
                          text: '취소',
                          style: 'cancel',
                        },
                        {
                          text: '삭제',
                          style: 'destructive',
                          onPress: () => {
                            // TODO: 게시물 삭제 API 호출
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text className='text-red-500'>삭제</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 게시물 이미지 */}
            <View className='w-full' style={{ height: POST_WIDTH }}>
              <FlatList
                data={feed.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / POST_WIDTH
                  );
                  handleImageIndexChange(feed.id, index);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    className='w-full h-full'
                    style={{ width: POST_WIDTH, height: POST_WIDTH }}
                    resizeMode='cover'
                  />
                )}
              />
              {feed.images.length > 1 && (
                <View className='absolute bottom-2 left-0 right-0 flex-row justify-center items-center'>
                  {feed.images.map((_, index) => (
                    <View
                      key={index}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        currentImageIndices[feed.id] === index
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* 게시물 액션 버튼 */}
            <View className='flex-row items-center gap-[10px] py-2 px-5'>
              <View className='flex-row items-center'>
                <TouchableOpacity>
                  <Ionicons
                    name={feed.isLiked ? 'heart' : 'heart-outline'}
                    size={24}
                    color={feed.isLiked ? '#ff0000' : 'black'}
                  />
                </TouchableOpacity>
                <Text className='text-black text-sm ml-1'>{feed.likes}</Text>
              </View>
              <View className='flex-row items-center'>
                <TouchableOpacity onPress={() => setShowCommentModal(feed.id)}>
                  <Ionicons name='chatbubble-outline' size={24} color='black' />
                </TouchableOpacity>
                <Text className='text-black text-sm ml-1'>{feed.comments}</Text>
              </View>
            </View>

            {/* 게시물 내용 */}
            <View className='px-5 py-2'>
              <Text>
                <Text className='font-medium'>{feed.nickName}</Text>{' '}
                {feed.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <FeedCommentModal
        visible={showCommentModal !== null}
        onClose={() => setShowCommentModal(null)}
        feedId={showCommentModal || 0}
      />
    </SafeAreaView>
  );
}
