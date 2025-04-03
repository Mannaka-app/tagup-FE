import { useQuery, useMutation } from '@tanstack/react-query';
import { getTeams, updateTeam } from '@/apis/teams';
import { Team } from '@/types/team';
import { useAuthStore } from '@/store/useAuthStore';

// 팀 전체 정보 들고오는 훅
export const useTeams = () => {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: getTeams,
  });
};

// 팀 업데이트 훅
export const useUpdateTeam = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: updateTeam,
    onSuccess: (response) => {
      setUser(response.user);
    },
  });
};
