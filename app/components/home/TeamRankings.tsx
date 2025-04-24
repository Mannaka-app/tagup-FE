import React from 'react';
import { View, Text, Image } from 'react-native';
import { GameRankingStandings, TeamInfo } from '@/apis/main';

interface TeamRankingsProps {
  rankings: GameRankingStandings[];
  teams: TeamInfo[];
}

export default function TeamRankings({ rankings, teams }: TeamRankingsProps) {
  // 팀 ID로 팀 정보 찾기
  const getTeamInfo = (teamId: number) => {
    return teams.find((team) => team.id === teamId) as TeamInfo;
  };

  return (
    <View className='bg-white rounded-lg border border-gray-200'>
      {/* 헤더 */}
      <View className='flex-row px-4 py-3 border-b border-gray-200 bg-gray-50'>
        <Text className='w-10 font-medium'>순위</Text>
        <Text className='flex-1 font-medium'>구단</Text>
        <Text className='w-16 text-right font-medium'>승</Text>
        <Text className='w-16 text-right font-medium'>패</Text>
        <Text className='w-16 text-right font-medium'>승률</Text>
      </View>

      {/* 순위 목록 */}
      {rankings.map((team) => {
        const teamInfo = getTeamInfo(team.teamId);
        const winRate = (team.wins / (team.wins + team.losses)) * 100;
        return (
          <View
            key={`${team.id}-${team.teamId}`}
            className='flex-row items-center px-4 py-3 border-b border-gray-100 last:border-b-0'
          >
            <Text className='w-10 text-gray-600'>{team.rank}</Text>
            <View className='flex-1 flex-row items-center'>
              <Image
                source={{ uri: teamInfo?.badge }}
                className='w-6 h-6 mr-2'
                resizeMode='contain'
              />
              <Text>{teamInfo?.name}</Text>
            </View>
            <Text className='w-16 text-right'>{team.wins}</Text>
            <Text className='w-16 text-right'>{team.losses}</Text>
            <Text className='w-16 text-right'>{winRate.toFixed(1)}%</Text>
          </View>
        );
      })}
    </View>
  );
}
