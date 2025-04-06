import { setUserDetail } from '@/apis/auth';
import { deleteProfileImage } from '@/apis/mypage';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUser = () => {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: setUserDetail,
    onSuccess: (response) => {
      setUser(response.user);
    },
  });
};

export const useDeleteProfileImage = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
