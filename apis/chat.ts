import fetcher from '@/utils/fetcher';

export interface ChatRoom {
  id: number;
  title: string;
  createAt: string;
  members: number;
}

interface ChatRoomsResponse {
  success: boolean;
  message: string;
  rooms: ChatRoom[];
}

export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetcher<ChatRoomsResponse>({
    url: '/chat',
    method: 'GET',
  });
  return response.data.rooms;
};

export const myChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetcher<ChatRoomsResponse>({
    url: '/chat/my',
    method: 'GET',
  });
  return response.data.rooms;
};

export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
}

export const imageUpload = async (
  file: FormData
): Promise<ImageUploadResponse> => {
  const response = await fetcher<ImageUploadResponse>({
    url: '/chat/image',
    method: 'POST',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
