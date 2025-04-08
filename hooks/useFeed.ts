import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFeed,
  createFeed,
  CreateFeedRequest,
  postFeedImg,
  PostFeedImgResponse,
  postFeedComment,
  PostFeedCommentRequest,
  getFeedComments,
} from '@/apis/feed';

// 피드 데이터 조회
export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  });
};

// 피드 데이터 생성
export const useCreateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeedRequest) => createFeed(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

// 피드 이미지 업로드
export const useUploadFeedImage = () => {
  return useMutation({
    mutationFn: async (file: FormData) => {
      const response = await postFeedImg(file);
      return response;
    },
  });
};

// 피드 댓글 작성
export const usePostFeedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostFeedCommentRequest) => postFeedComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments'] });
    },
  });
};

// 피드 댓글 조회
export const useFeedComments = (
  feedId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['feedComments', feedId],
    queryFn: () => getFeedComments(feedId),
    enabled: options?.enabled,
  });
};
