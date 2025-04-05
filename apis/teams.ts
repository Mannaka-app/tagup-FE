import fetcher from '@/utils/fetcher';
import { LoginResponse } from './auth';

export interface Team {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

// 팀 전체 정보 들고오는 api
export const getTeams = async (): Promise<Team[]> => {
  const response = await fetcher<Team[]>({
    url: '/users/teams',
    method: 'GET',
  });
  return response.data;
};

// 팀 정보 업데이트 api
export const updateTeam = async (teamId: number): Promise<LoginResponse> => {
  const response = await fetcher<LoginResponse>({
    url: `/users/teams`,
    method: 'POST',
    data: { teamId },
  });
  console.log('팀 정보 업데이트 api', response.data);
  return response.data;
};
