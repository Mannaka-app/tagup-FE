import { useQuery } from '@tanstack/react-query';
import { getWeeklyGames } from '@/apis/main';

export const useWeeklyGames = () => {
  return useQuery({
    queryKey: ['weeklyGames'],
    queryFn: getWeeklyGames,
  });
};
