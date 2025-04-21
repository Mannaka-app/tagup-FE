import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { useWeeklyGames } from '@/hooks/useMain';
import { GameSchedule } from '@/apis/main';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { data: gamesData, isLoading } = useWeeklyGames();

  // 날짜별로 경기를 그룹화
  const gamesByDate = useMemo(() => {
    if (!gamesData?.schedules) return [];

    const groupedGames = new Map<string, GameSchedule[]>();
    gamesData.schedules.forEach((game: GameSchedule) => {
      const date = new Date(game.date);
      const dateKey = date.toISOString().split('T')[0];
      if (!groupedGames.has(dateKey)) {
        groupedGames.set(dateKey, []);
      }
      groupedGames.get(dateKey)?.push(game);
    });

    return Array.from(groupedGames.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, games]) => ({ date, games }));
  }, [gamesData?.schedules]);

  // 오늘 날짜의 인덱스 찾기
  const todayIndex = useMemo(() => {
    if (!gamesByDate.length) return 0;
    const today = new Date().toISOString().split('T')[0];
    return Math.max(
      0,
      gamesByDate.findIndex((item) => item.date === today)
    );
  }, [gamesByDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${date.getMonth() + 1}월 ${date.getDate()}일(${weekDay})`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NS':
        return { bg: '#e5e7eb', text: '#6b7280' };
      case 'FT':
        return { bg: '#10b981', text: '#ffffff' };
      default:
        return { bg: '#f59e0b', text: '#ffffff' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NS':
        return '경기예정';
      case 'FT':
        return '경기종료';
      default:
        return '진행중';
    }
  };

  const renderItem = ({
    item,
  }: {
    item: { date: string; games: GameSchedule[] };
  }) => (
    <View style={{ width: SCREEN_WIDTH }} className='flex-1 px-4'>
      {/* 날짜 헤더 */}
      <View className=' px-4 py-2'>
        <Text className='font-medium text-center'>{formatDate(item.date)}</Text>
      </View>

      {/* 경기 목록 */}
      <View className='bg-white border border-black'>
        {item.games.map((game: GameSchedule) => {
          const statusColor = getStatusColor(game.status);
          return (
            <View
              key={game.id}
              className='p-4 border-b border-gray-100 last:border-b-0'
            >
              {/* 팀 정보 */}
              <View className='flex-row items-center justify-between'>
                {/* 홈팀 */}
                <View className='flex-1 items-center'>
                  <Image
                    source={{ uri: game.homeTeam.badge }}
                    className='w-16 h-16'
                    resizeMode='contain'
                  />
                </View>

                {/* 경기 시간 & 구장 정보 */}
                <View className='flex-1 items-center'>
                  <View
                    className='px-4 py-1 rounded-full mb-2'
                    style={{ backgroundColor: statusColor.bg }}
                  >
                    <Text
                      className='text-xs'
                      style={{ color: statusColor.text }}
                    >
                      {getStatusText(game.status)}
                    </Text>
                  </View>
                  <Text className='text-lg font-bold'>
                    {formatTime(game.date)}
                  </Text>
                  <Text className='text-gray-600 text-xs mt-1'>
                    {game.stadiumInfo.name}
                  </Text>
                </View>

                {/* 원정팀 */}
                <View className='flex-1 items-center'>
                  <Image
                    source={{ uri: game.awayTeam.badge }}
                    className='w-16 h-16'
                    resizeMode='contain'
                  />
                </View>
              </View>

              {/* 스코어 (경기 종료인 경우) */}
              {game.status === 'FT' && (
                <View className='flex-row justify-center items-center mt-4'>
                  <Text
                    className='text-2xl font-bold'
                    style={{ color: game.homeTeam.color }}
                  >
                    {game.homeScore}
                  </Text>
                  <Text className='text-xl mx-3'>:</Text>
                  <Text
                    className='text-2xl font-bold'
                    style={{ color: game.awayTeam.color }}
                  >
                    {game.awayScore}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {/* 헤더 */}
      <View className='flex-row items-center justify-between px-5 py-4'>
        <Text className='text-xl font-logo'>tagup</Text>
      </View>

      <ScrollView className='flex-1'>
        {/* 경기 일정 */}
        {isLoading ? (
          <View className='flex-1 items-center justify-center py-10'>
            <Text>로딩 중...</Text>
          </View>
        ) : gamesByDate.length === 0 ? (
          <View className='flex-1 items-center justify-center py-10'>
            <Text className='text-gray-500'>
              이번 주 예정된 경기가 없습니다.
            </Text>
          </View>
        ) : (
          <View className='flex-1'>
            <FlatList
              data={gamesByDate}
              renderItem={renderItem}
              keyExtractor={(item) => item.date}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={todayIndex}
              getItemLayout={(data, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
            />
          </View>
        )}

        {/* 여기에 추가 컨텐츠를 넣을 수 있습니다 */}
        <View className='p-4'>
          <Text className='text-gray-500'>
            추가 컨텐츠가 들어갈 영역입니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
