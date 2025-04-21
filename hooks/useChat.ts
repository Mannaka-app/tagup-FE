import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatRooms, myChatRooms, ChatRoom, imageUpload } from '@/apis/chat';

export const useChatRooms = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
  });

  const refetchChatRooms = async () => {
    const data = await getChatRooms();
    queryClient.setQueryData(['chatRooms'], data);
    return data;
  };

  return {
    ...query,
    refetchChatRooms,
  };
};

export const useMyChatRooms = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['myChatRooms'],
    queryFn: myChatRooms,
  });

  const refetchMyChatRooms = async () => {
    const data = await myChatRooms();
    queryClient.setQueryData(['myChatRooms'], data);
    return data;
  };

  return {
    ...query,
    refetchMyChatRooms,
  };
};

export const useImageUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: FormData) => {
      const response = await imageUpload(file);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });
};
