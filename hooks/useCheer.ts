import { getCheerRoom } from '@/apis/cheer';
import { useQuery } from '@tanstack/react-query';

export const useCheer = (teamId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cheer', teamId],
    queryFn: () => getCheerRoom(teamId),
  });
  return {
    data,
    isLoading,
    error,
  };
};
