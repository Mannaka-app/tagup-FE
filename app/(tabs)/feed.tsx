// 피드 이미지 배열 탭

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';
import { useFeed, useDeleteFeed } from '@/hooks/useFeed';
import { router } from 'expo-router';
import FeedCommentModal from '@/app/components/FeedCommentModal';
import { Feed, FeedResponse } from '@/apis/feed';
import { InfiniteData } from '@tanstack/react-query';

const WINDOW_WIDTH = Dimensions.get('window').width;
const GAP_SIZE = 12; // 가로 간격 증가
const VERTICAL_GAP = 20; // 세로 간격 증가
const NUMBER_OF_COLUMNS = 2;
const CONTENT_PADDING = 12; // 전체 패딩 증가
const USABLE_WIDTH =
  WINDOW_WIDTH - CONTENT_PADDING * 2 - GAP_SIZE * (NUMBER_OF_COLUMNS - 1);
const COLUMN_WIDTH = USABLE_WIDTH / NUMBER_OF_COLUMNS;

// URL을 기반으로 고정된 비율을 생성하는 함수
const getAspectRatioFromUrl = (url: string) => {
  // URL의 각 문자의 아스키 코드 값을 합산
  const sum = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // 합산 값을 0과 1 사이의 값으로 정규화
  const normalizedValue = (sum % 100) / 100;
  // 1 ~ 1.25 사이의 값으로 매핑
  return 1 + normalizedValue * 0.25;
};

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
  const {
    data: feedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed() as {
    data: InfiniteData<FeedResponse> | undefined;
    isLoading: boolean;
    fetchNextPage: () => Promise<unknown>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  };
  const deleteFeed = useDeleteFeed();
  const [showCommentModal, setShowCommentModal] = useState<number | null>(null);

  // 이미지 프리로딩
  useEffect(() => {
    if (!feedData?.pages[0].feed) return;

    // 화면에 보이는 이미지만 우선 프리로드 (처음 10개)
    const imagesToPreload = feedData.pages[0].feed
      .slice(0, 10)
      .map((feed: Feed) => feed.image);

    // 프리로드 시작
    Promise.all(imagesToPreload.map((url: string) => Image.prefetch(url))).then(
      () => {
        console.log('First batch of images preloaded');

        // 나머지 이미지들은 낮은 우선순위로 프리로드
        if (feedData.pages[0].feed.length > 10) {
          const remainingImages = feedData.pages[0].feed
            .slice(10)
            .map((feed: Feed) => feed.image);
          Promise.all(
            remainingImages.map((url: string) => Image.prefetch(url))
          ).then(() => console.log('Remaining images preloaded'));
        }
      }
    );
  }, [feedData?.pages[0].feed]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 모든 페이지의 피드 데이터를 하나의 배열로 합치기
  const allFeeds =
    feedData?.pages.reduce((acc: Feed[], page: FeedResponse) => {
      return [...acc, ...page.feed];
    }, [] as Feed[]) || [];

  // 이미지 크기 계산 및 컬럼 분배
  const allImages = allFeeds.reduce(
    (
      acc: { id: number; imageUrl: string; width: number; height: number }[],
      feed: Feed
    ) => {
      const aspectRatio = getAspectRatioFromUrl(feed.image);
      const height = COLUMN_WIDTH * aspectRatio;

      return [
        ...acc,
        {
          id: feed.id,
          imageUrl: feed.image,
          width: COLUMN_WIDTH,
          height,
        },
      ];
    },
    []
  );

  // 이미지를 두 컬럼으로 분배
  const [leftColumn, rightColumn] = allImages.reduce<
    Array<{ items: typeof allImages; height: number }>
  >(
    (columns, image) => {
      if (columns[0].height <= columns[1].height) {
        columns[0].items.push(image);
        columns[0].height += image.height + VERTICAL_GAP;
      } else {
        columns[1].items.push(image);
        columns[1].height += image.height + VERTICAL_GAP;
      }
      return columns;
    },
    [
      { items: [], height: 0 },
      { items: [], height: 0 },
    ]
  );

  const renderColumn = (items: typeof allImages, isLeft: boolean) => (
    <View style={{ flex: 1 }}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={`${item.id}-${index}`}
          onPress={() => router.push(`/feed/${item.id}`)}
          style={{
            width: '100%',
            height: item.height,
            marginBottom: VERTICAL_GAP,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode='cover'
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleDeleteFeed = (feedId: number) => {
    Alert.alert('게시물 삭제', '정말로 이 게시물을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteFeed.mutate(feedId);
        },
      },
    ]);
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
      <View className='flex-row items-center justify-between px-5 py-4'>
        <Text className='text-xl font-logo'>Post</Text>
        <View className='flex-row items-center gap-4'>
          <TouchableOpacity onPress={() => router.push('/feed/create')}>
            <Ionicons name='add-outline' size={22} color='black' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: CONTENT_PADDING,
          paddingBottom: CONTENT_PADDING + 20,
        }}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 50;

          if (isCloseToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={{ flexDirection: 'row', gap: GAP_SIZE }}>
          {renderColumn(leftColumn.items, true)}
          {renderColumn(rightColumn.items, false)}
        </View>
        {isFetchingNextPage && (
          <View className='py-4 items-center'>
            <ActivityIndicator color='#0000ff' />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
