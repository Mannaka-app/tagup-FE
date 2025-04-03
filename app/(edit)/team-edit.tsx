import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTeams, Team } from '@/apis/teams';
import { useAuthStore } from '@/store/useAuthStore';
import { useTeams, useUpdateTeam } from '@/hooks/useTeams';

export default function TeamEditScreen() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const { data: teams = [] } = useTeams();
  const { mutate: updateTeam } = useUpdateTeam();
  const { user } = useAuthStore();

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleConfirm = async () => {
    if (selectedTeam && user) {
      try {
        updateTeam(parseInt(selectedTeam), {
          onSuccess: () => {
            router.replace('/(tabs)/mypage');
          },
        });
      } catch (error) {
        console.error('팀 선택 저장 실패:', error);
      }
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white px-4 py-3'>
      <View className='flex-1 gap-[20px]'>
        <View className='flex-row justify-between items-center'>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className='text-red-500'>취소</Text>
          </TouchableOpacity>
          <Text className='text-lg font-regular'>팀선택</Text>
          <TouchableOpacity onPress={handleConfirm} disabled={!selectedTeam}>
            <Text
              className={`${selectedTeam ? 'text-blue-500' : 'text-gray-400'}`}
            >
              확인
            </Text>
          </TouchableOpacity>
        </View>
        <View className='flex flex-col gap-[10px]'>
          <Text className='text-xl font-semibold text-black'>
            응원하는 팀을 선택해주세요!
          </Text>
          <Text className='text-gray-600 '>
            같은 팀을 응원하는 친구들과 함께 소통해보세요!
          </Text>
        </View>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='flex-row flex-wrap justify-between gap-y-4'>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => handleTeamSelect(team.id.toString())}
                className={`w-[48%] p-[24px] rounded-xl border-[1px]`}
                style={{
                  borderColor: team.color,
                  backgroundColor:
                    selectedTeam === team.id.toString()
                      ? `${team.color}15`
                      : undefined,
                }}
              >
                <View className='items-center gap-[10px]'>
                  <Text className='text-2xl'>{team.emoji}</Text>
                  <Text className='font-light text-center'>{team.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
