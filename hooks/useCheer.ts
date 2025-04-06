import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheerResponse,
  deleteCheer,
  getCheer,
  likeCheer,
  postCheer,
} from '@/apis/cheer';
import { useAuthStore } from '@/store/useAuthStore';

export const useCheers = () => {
  const { user } = useAuthStore();
  const { data, refetch } = useQuery<CheerResponse['cheerTalks']>({
    queryKey: ['cheers', user?.teams?.id],
    queryFn: () => getCheer().then((res) => res.cheerTalks),
    staleTime: 0,
    gcTime: 0,
  });

  return { data, refetch };
};

export const useLikeCheer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: likeCheer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheers', user?.teams?.id] });
    },
  });
};

export const usePostCheer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: postCheer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheers', user?.teams?.id] });
    },
  });
};

export const useDeleteCheer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: deleteCheer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheers', user?.teams?.id] });
    },
  });
};
