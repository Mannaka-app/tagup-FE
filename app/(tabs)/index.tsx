import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { useWeeklyGames, useRankings, useTeamSchedule } from '@/hooks/useMain';
import { useTeams } from '@/hooks/useTeams';
import { useRouter } from 'expo-router';
import GameScheduleModal from '@/app/components/home/GameScheduleModal';
import NextGame from '@/app/components/home/NextGame';
import TeamSchedule from '@/app/components/home/TeamSchedule';
import TeamRankings from '@/app/components/home/TeamRankings';
import TeamInfo from '@/app/components/home/TeamInfo';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: gamesData } = useWeeklyGames();
  const { data: teamScheduleData } = useTeamSchedule(user?.teams?.id || 0);
  const { data: rankingsData } = useRankings();
  const { data: teams = [] } = useTeams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 팀 ID로 팀 정보 찾기
  const getTeamInfo = (teamId: number) => {
    return teams.find((team) => team.id === teamId);
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {/* 헤더 */}
      <View className='flex-row items-start justify-between px-5 mb-2'>
        {/* tagup 로고 */}
        <Text className='text-2xl font-logo'>tagup</Text>

        {/* 팀 로고 */}
        {user?.teams && (
          <Image
            source={{ uri: getTeamInfo(user.teams.id)?.badge }}
            className='w-12 h-12'
            resizeMode='contain'
          />
        )}
      </View>

      <ScrollView
        className='flex-1 bg-white'
        showsVerticalScrollIndicator={false}
      >
        {/* 메인 컨텐츠 */}
        <View className='p-4'>
          <View className='flex-1 gap-4'>
            {user?.teams && rankingsData?.standings && (
              <>
                <TeamInfo
                  team={getTeamInfo(user.teams.id)!}
                  ranking={
                    rankingsData.standings.find(
                      (standing) => standing.teamId === user.teams?.id
                    )!
                  }
                />
                <TouchableOpacity
                  className='px-4 py-2 rounded-lg items-center mt-4'
                  style={{
                    backgroundColor: getTeamInfo(user.teams.id)?.color,
                  }}
                  onPress={() => {
                    if (user.teams?.id) {
                      router.push(`/cheer/${user.teams.id}`);
                    }
                  }}
                >
                  <Text className='text-lg text-white font-light'>
                    {user?.teams?.name} 응원 톡방
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <Text className='font-light mb-2 text-lg'>
              {user?.teams?.name} 다음 경기
            </Text>
            {teamScheduleData?.schedules[0] && (
              <NextGame game={teamScheduleData.schedules[0]} />
            )}

            {/* 일주일 경기 일정 */}
            <View className='mt-6'>
              <Text className='font-light mb-2 text-lg'>
                이번주 {user?.teams?.name} 경기 일정
              </Text>
              <TeamSchedule games={teamScheduleData?.schedules || []} />
            </View>
          </View>

          {/* KBO 경기 일정 보기 */}
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className='px-4 py-2 rounded-lg items-center mt-4'
            style={{
              backgroundColor: getTeamInfo(user?.teams?.id || 0)?.color,
            }}
          >
            <Text className='text-lg text-white font-light'>
              KBO 경기 일정 보기
            </Text>
          </TouchableOpacity>

          {/* 구단 랭킹 */}
          <View className='mt-6'>
            <Text className='font-light mb-2 text-lg'>구단 순위</Text>
            <TeamRankings
              rankings={rankingsData?.standings || []}
              teams={teams}
            />
          </View>
        </View>
      </ScrollView>

      {/* 경기 일정 모달 */}
      <GameScheduleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        gamesData={gamesData}
        isLoading={false}
      />
    </SafeAreaView>
  );
}
