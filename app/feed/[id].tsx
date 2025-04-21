import { useLocalSearchParams } from 'expo-router';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  useFeedDetail,
  useDeleteFeed,
  useFeedComments,
  usePostFeedComment,
  useDeleteFeedComment,
} from '@/hooks/useFeed';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { likeFeed } from '@/apis/feed';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import FeedCommentModal from '@/app/components/FeedCommentModal';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MAX_HEIGHT = WINDOW_WIDTH * 1.5; // 최대 높이는 화면 너비의 1.5배
const MIN_HEIGHT = WINDOW_WIDTH * 0.8; // 최소 높이는 화면 너비의 0.8배

interface ImageDimension {
  url: string;
  height: number;
  loaded?: boolean;
}

export default function FeedDetailScreen() {
  const insets = useSafeAreaInsets(); // 안전 영역 사용

  // 1. Navigation & Route Hooks
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 2. Data & State Management Hooks
  const queryClient = useQueryClient();
  const { data, isLoading } = useFeedDetail(Number(id));
  const { user } = useAuthStore();
  const deleteFeedMutation = useDeleteFeed();
  const likeMutation = useMutation({
    mutationFn: likeFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedDetail', Number(id)] });
    },
  });
  const { data: commentsData } = useFeedComments(Number(id), { enabled: true });
  const postCommentMutation = usePostFeedComment();
  const deleteCommentMutation = useDeleteFeedComment();

  // 3. UI State Hooks
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<ImageDimension[]>([]);
  const fadeAnims = useRef<Animated.Value[]>([]);
  const loadedImages = useRef<Set<string>>(new Set());
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  // 4. Callbacks
  const loadImage = useCallback((url: string, index: number) => {
    if (loadedImages.current.has(url)) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      Image.getSize(
        url,
        (width, height) => {
          const aspectRatio = height / width;
          let calculatedHeight = WINDOW_WIDTH * aspectRatio;
          if (calculatedHeight > MAX_HEIGHT) calculatedHeight = MAX_HEIGHT;
          if (calculatedHeight < MIN_HEIGHT) calculatedHeight = MIN_HEIGHT;

          setImageDimensions((prev) => {
            const newDimensions = [...prev];
            newDimensions[index] = {
              url,
              height: calculatedHeight,
              loaded: true,
            };
            return newDimensions;
          });

          Image.prefetch(url).then(() => {
            loadedImages.current.add(url);
            if (fadeAnims.current[index]) {
              Animated.timing(fadeAnims.current[index], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }
            resolve();
          });
        },
        () => {
          setImageDimensions((prev) => {
            const newDimensions = [...prev];
            newDimensions[index] = {
              url,
              height: WINDOW_WIDTH,
              loaded: false,
            };
            return newDimensions;
          });
          resolve();
        }
      );
    });
  }, []);

  const onScroll = useCallback((e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / WINDOW_WIDTH);
    setCurrentImageIndex(newIndex);
  }, []);

  const handleDeleteFeed = useCallback(() => {
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
            deleteFeedMutation.mutate(Number(id), {
              onSuccess: () => {
                Alert.alert('알림', '게시물이 삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => {
                      router.replace('/(tabs)/feed');
                    },
                  },
                ]);
              },
              onError: () => {
                Alert.alert('오류', '게시물 삭제 중 오류가 발생했습니다.');
              },
            });
          },
        },
      ],
      { cancelable: true }
    );
  }, [deleteFeedMutation, id, router]);

  const handlePostComment = useCallback(
    (content: string) => {
      postCommentMutation.mutate(
        { feedId: Number(id), content },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['feedComments', Number(id)],
            });
            queryClient.invalidateQueries({
              queryKey: ['feedDetail', Number(id)],
            });
          },
        }
      );
    },
    [id, postCommentMutation, queryClient]
  );

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      deleteCommentMutation.mutate(
        { feedId: Number(id), commentId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['feedComments', Number(id)],
            });
            queryClient.invalidateQueries({
              queryKey: ['feedDetail', Number(id)],
            });
          },
        }
      );
    },
    [id, deleteCommentMutation, queryClient]
  );

  // 5. Effects
  useEffect(() => {
    if (!data?.feed.images) return;
    fadeAnims.current = data.feed.images.map(() => new Animated.Value(0));
    const initialLoadImages = data.feed.images.slice(0, 2);
    Promise.all(initialLoadImages.map((url, index) => loadImage(url, index)));
  }, [data?.feed.images, loadImage]);

  useEffect(() => {
    if (!data?.feed.images) return;
    const nextIndex = currentImageIndex + 1;
    if (nextIndex < data.feed.images.length) {
      loadImage(data.feed.images[nextIndex], nextIndex);
    }
  }, [currentImageIndex, data?.feed.images, loadImage]);

  // Loading state
  if (isLoading || !data) return null;

  const { feed } = data;

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => {
    const dimension = imageDimensions[index];
    const height = dimension ? dimension.height : WINDOW_WIDTH;

    return (
      <View style={{ width: WINDOW_WIDTH, height }}>
        {/* 스켈레톤 UI */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6',
          }}
        />

        {/* 실제 이미지 */}
        <Animated.Image
          source={{ uri: item }}
          style={{
            width: WINDOW_WIDTH,
            height,
            opacity: fadeAnims.current[index],
          }}
          resizeMode='cover'
        />
      </View>
    );
  };

  // FlatList 성능 최적화를 위한 설정
  const keyExtractor = (item: string) => item;
  const getItemLayout = (_: any, index: number) => ({
    length: WINDOW_WIDTH,
    offset: WINDOW_WIDTH * index,
    index,
  });

  return (
    <SafeAreaView className='flex-1 bg-black' edges={['top']}>
      <ScrollView className='flex-1 rounded-t-3xl bg-white'>
        <View className='relative'>
          {/* 그라데이션 배경 */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'transparent']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              paddingTop: insets.top + 2,
              zIndex: 2,
            }}
          />

          {/* 헤더 버튼 */}
          <View className='absolute z-10 top-2 w-full flex-row justify-between px-2'>
            <TouchableOpacity className='p-2' onPress={() => router.back()}>
              <Ionicons name='chevron-back' size={24} color='white' />
            </TouchableOpacity>
            {user?.id === data?.feed.userId && (
              <TouchableOpacity className='p-2' onPress={handleDeleteFeed}>
                <Ionicons name='ellipsis-horizontal' size={24} color='white' />
              </TouchableOpacity>
            )}
          </View>

          {/* 이미지 슬라이더 */}
          <FlatList
            data={feed.images}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            style={{ width: WINDOW_WIDTH }}
          />

          {/* 페이지 인디케이터 */}
          {feed.images.length > 1 && (
            <View className='absolute bottom-4 left-0 right-0 flex-row justify-center gap-2'>
              {feed.images.map((_, index) => (
                <View
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* 컨텐츠 영역 */}
        <View className='p-4'>
          {/* 유저 정보 */}
          <View className='flex-row items-center gap-2'>
            <Image
              source={{ uri: feed.profileUrl }}
              className='h-10 w-10 rounded-full'
            />
            <View>
              <Text className='font-semibold'>{feed.nickName}</Text>
              <Text className='text-sm text-gray-500'>
                {formatDate(feed.createdAt)}
              </Text>
            </View>
          </View>

          {/* 피드 내용 */}
          <Text className='mt-4 text-base leading-6'>{feed.content}</Text>

          {/* 하단 정보 */}
          <View className='mt-4 flex-row items-center justify-between gap-2 border-b border-gray-100 pb-4'>
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity
                className='flex-row items-center gap-1'
                onPress={() => likeMutation.mutate(feed.id)}
              >
                <Ionicons
                  name={feed.isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={feed.isLiked ? '#ef4444' : 'black'}
                />
                <Text>{feed.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-row items-center gap-1'
                onPress={() => setIsCommentModalVisible(true)}
              >
                <Ionicons name='chatbubble-outline' size={22} color='black' />
                <Text>{feed.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 댓글 */}
          <View className='mt-4'>
            <Text className='text-lg font-semibold mb-2'>댓글</Text>
            {commentsData?.comment.map((comment) => (
              <View
                key={comment.id}
                className='flex-row items-start space-x-2 py-3'
              >
                <Image
                  source={{ uri: comment.profileUrl }}
                  className='h-8 w-8 rounded-full'
                />
                <View className='flex-1'>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center space-x-2'>
                      <Text className='font-semibold'>{comment.nickName}</Text>
                      <Text className='text-xs text-gray-500'>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </View>
                    {user?.id === comment.userId && (
                      <TouchableOpacity
                        onPress={() => handleDeleteComment(comment.id)}
                        className='p-1'
                      >
                        <Ionicons
                          name='trash-outline'
                          size={16}
                          color='#ef4444'
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text className='mt-1'>{comment.content}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 댓글 모달 */}
      <FeedCommentModal
        visible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        onSubmit={handlePostComment}
        onDelete={handleDeleteComment}
        comments={commentsData?.comment || []}
      />
    </SafeAreaView>
  );
}
