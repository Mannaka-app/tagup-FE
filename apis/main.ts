import fetcher from '@/utils/fetcher';

export interface TeamInfo {
  id: number;
  name: string;
  color: string;
  emoji: string;
  badge: string;
  logo: string;
}

export interface StadiumInfo {
  id: number;
  name: string;
  location: string;
  homeTeam: number;
}

export interface GameSchedule {
  id: number;
  home: number;
  homeScore: number;
  away: number;
  awayScore: number;
  stadium: number;
  date: string;
  status: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  stadiumInfo: StadiumInfo;
}

export interface GameScheduleResponse {
  success: boolean;
  schedules: GameSchedule[];
}

// 이번 주 KBO 경기 일정 조회
export const getWeeklyGames = async (): Promise<GameScheduleResponse> => {
  const response = await fetcher<GameScheduleResponse>({
    url: '/game/week',
    method: 'GET',
  });
  console.log(response.data);
  return response.data;
};
