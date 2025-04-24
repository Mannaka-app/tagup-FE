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
  return response.data;
};

export interface GameRankingStandings {
  id: number;
  teamId: number;
  rank: number;
  wins: number;
  losses: number;
  draws: number;
  winrRate: number;
}

export interface GameRankingResponse {
  success: boolean;
  message: string;
  standings: GameRankingStandings[];
}

// 이번 주 KBO 순위 조회
export const getRankings = async (): Promise<GameRankingResponse> => {
  const response = await fetcher<GameRankingResponse>({
    url: '/game/rank',
    method: 'GET',
  });
  return response.data;
};

export interface TeamScheduleResponse {
  success: boolean;
  schedules: GameSchedule[];
}

// 팀 경기 일정 조회
export const getTeamSchedule = async (
  teamId: number
): Promise<TeamScheduleResponse> => {
  const response = await fetcher<TeamScheduleResponse>({
    url: `/game/team/${teamId}`,
    method: 'GET',
  });
  return response.data;
};
