import React from 'react';
import { View, Text, Image } from 'react-native';
import { GameSchedule } from '@/apis/main';

interface TeamScheduleProps {
  games: GameSchedule[];
}

export default function TeamSchedule({ games }: TeamScheduleProps) {
  return (
    <View className='bg-white rounded-lg border border-gray-200'>
      {games.map((game) => (
        <View
          key={game.id}
          className='p-4 border-b border-gray-100 last:border-b-0'
        >
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 items-center'>
              <Image
                source={{ uri: game.homeTeam.badge }}
                className='w-8 h-8'
                resizeMode='contain'
              />
              <Text className='text-sm mt-1'>{game.homeTeam.name}</Text>
            </View>
            <View className='flex-1 items-center'>
              <Text className='text-sm text-gray-500'>
                {new Date(game.date).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </Text>
              <Text className='text-sm text-gray-500'>
                {new Date(game.date).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Text>
              <Text
                className='text-xs
               text-gray-500'
              >
                {game.stadiumInfo.name}
              </Text>
              {game.status === 'FT' && (
                <View className='flex-row items-center mt-1'>
                  <Text className='font-bold'>{game.homeScore}</Text>
                  <Text className='mx-2'>:</Text>
                  <Text className='font-bold'>{game.awayScore}</Text>
                </View>
              )}
            </View>
            <View className='flex-1 items-center'>
              <Image
                source={{ uri: game.awayTeam.badge }}
                className='w-8 h-8'
                resizeMode='contain'
              />
              <Text className='text-sm mt-1'>{game.awayTeam.name}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
