import fetcher from '@/utils/fetcher';

export interface CheerRoomResponse {
  success: boolean;
  cheerRoom: CheerRoom;
}

export interface CheerRoom {
  id: number;
  teamId: number;
  title: string;
  thumnailUrl: string;
}

export const getCheerRoom = async (teamId: number) => {
  const response = await fetcher<CheerRoomResponse>({
    url: `/cheer/${teamId}`,
    method: 'GET',
  });
  console.log(response.data);
  return response.data;
};
