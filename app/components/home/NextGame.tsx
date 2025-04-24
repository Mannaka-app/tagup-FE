import React from 'react';
import { View, Text, Image } from 'react-native';
import { GameSchedule } from '@/apis/main';
import { useAuthStore } from '@/store/useAuthStore';
import { useTeams } from '@/hooks/useTeams';

interface NextGameProps {
  game: GameSchedule;
}

export default function NextGame({ game }: NextGameProps) {
  const { user } = useAuthStore();
  const { data: teams = [] } = useTeams();

  // 현재 선택된 팀이 홈팀인지 확인
  const isMyTeamHome = game.homeTeam.id === user?.teams?.id;

  // 왼쪽에 표시할 팀과 오른쪽에 표시할 팀 결정
  const leftTeam = isMyTeamHome ? game.homeTeam : game.awayTeam;
  const rightTeam = isMyTeamHome ? game.awayTeam : game.homeTeam;

  // 팀 ID로 팀 정보 찾기
  const getTeamInfo = (teamId: number) => {
    return teams.find((team) => team.id === teamId);
  };

  return (
    <View
      className='bg-white rounded-lg border p-4'
      style={{
        borderColor: getTeamInfo(user?.teams?.id || 0)?.color + '20',
      }}
    >
      <View className='flex-row items-center justify-between'>
        {/* 팀 정보 */}
        <View className='flex-1 items-center gap-2'>
          <Image
            source={{ uri: leftTeam.badge }}
            className='w-12 h-12'
            resizeMode='contain'
          />
          <Text className='text-sm font-light'>{leftTeam.name}</Text>
        </View>

        <View className='flex-1 items-center'>
          {/* 날짜 */}
          <Text className='text-sm text-gray-500 mt-2 font-light'>
            {new Date(game.date).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </Text>
          {/* 시간 */}
          <Text className='text-sm text-gray-500 font-light'>
            {new Date(game.date).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </Text>
          {/* 경기장 */}
          <Text className='text-sm text-gray-500'>{game.stadiumInfo.name}</Text>
        </View>
        <View className='flex-1 items-center gap-2'>
          <Image
            source={{ uri: rightTeam.badge }}
            className='w-12 h-12'
            resizeMode='contain'
          />
          <Text className='text-sm font-light'>{rightTeam.name}</Text>
        </View>
      </View>
    </View>
  );
}
