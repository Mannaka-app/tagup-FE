import { setUserDetail } from '@/apis/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUser = () => {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: setUserDetail,
    onSuccess: (response) => {
      setUser(response.user);
    },
  });
};
