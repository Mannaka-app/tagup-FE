import { useQuery } from '@tanstack/react-query';
import { getRankings, getTeamSchedule, getWeeklyGames } from '@/apis/main';

export const useWeeklyGames = () => {
  return useQuery({
    queryKey: ['weeklyGames'],
    queryFn: getWeeklyGames,
  });
};

export const useRankings = () => {
  return useQuery({
    queryKey: ['weeklyRankings'],
    queryFn: getRankings,
  });
};

export const useTeamSchedule = (teamId: number) => {
  return useQuery({
    queryKey: ['teamSchedule', teamId],
    queryFn: () => getTeamSchedule(teamId),
  });
};
