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
  isLiked: boolean;
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
  return response.data;
};

export interface PostCheerResponse {
  success: boolean;
  message: string;
}

export const postCheer = async (content: string) => {
  const response = await fetcher<PostCheerResponse>({
    url: '/cheer',
    method: 'POST',
    data: { content },
  });
  return response.data;
};

export interface LikeCheerResponse {
  success: boolean;
  message: string;
}

export const likeCheer = async (cheerTalkId: number) => {
  const response = await fetcher<LikeCheerResponse>({
    url: `/cheer/likes`,
    method: 'POST',
    data: { cheerTalkId },
  });
  return response.data;
};

export interface DeleteCheerResponse {
  success: boolean;
  message: string;
}

export const deleteCheer = async (cheerTalkId: number) => {
  const response = await fetcher<DeleteCheerResponse>({
    url: `/cheer`,
    method: 'DELETE',
    data: { cheerTalkId },
  });
  return response.data;
};
