import fetcher from '@/utils/fetcher';

export interface CheerTalk {
  id: number;
  userId: number;
  nickname: string;
  profileUrl: string;
  userLevel: number;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CheerResponse {
  cheerTalks: CheerTalk[];
  lastCursor: number;
}

export const getCheer = async (): Promise<CheerResponse> => {
  const response = await fetcher<CheerResponse>({
    url: '/cheer',
    method: 'GET',
  });
  console.log('응원톡 데이터:', response.data);
  return response.data;
};
