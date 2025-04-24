import React from 'react';
import { View, Text, Image } from 'react-native';

interface TeamRanking {
  teamId: number;
  rank: number;
  wins: number;
  losses: number;
  draws: number;
}

interface TeamInfoProps {
  team: {
    id: number;
    name: string;
    badge: string;
    color: string;
  };
  ranking: TeamRanking;
}

export default function TeamInfo({ team, ranking }: TeamInfoProps) {
  return (
    <View className='items-center mb-6 rounded-lg p-4'>
      <Image
        source={{ uri: team.badge }}
        className='w-20 h-20'
        resizeMode='contain'
      />
      <Text className='text-lg font-light mt-2'>{team.name}</Text>
      <View className='flex-row gap-4 mt-2'>
        <View className='items-center'>
          <Text className='text-sm text-gray-500 font-light'>순위</Text>
          <Text className='text-lg' style={{ color: team.color }}>
            {ranking.rank}
          </Text>
        </View>
        <View className='items-center'>
          <Text className='text-sm text-gray-500 font-light'>승</Text>
          <Text className='text-lg' style={{ color: team.color }}>
            {ranking.wins}
          </Text>
        </View>
        <View className='items-center'>
          <Text className='text-sm text-gray-500 font-light'>패</Text>
          <Text className='text-lg' style={{ color: team.color }}>
            {ranking.losses}
          </Text>
        </View>
        <View className='items-center'>
          <Text className='text-sm text-gray-500 font-light'>무</Text>
          <Text className='text-lg' style={{ color: team.color }}>
            {ranking.draws}
          </Text>
        </View>
      </View>
    </View>
  );
}
