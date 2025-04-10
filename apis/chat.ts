import fetcher from '@/utils/fetcher';

export interface ChatRoom {
  id: number;
  title: string;
  createdAt: string;
}

export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetcher<ChatRoom[]>({
    url: '/chat',
    method: 'GET',
  });
  return response.data;
};
