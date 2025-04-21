import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  getFeed,
  createFeed,
  CreateFeedRequest,
  postFeedImg,
  PostFeedImgResponse,
  postFeedComment,
  PostFeedCommentRequest,
  getFeedComments,
  deleteFeed,
  likeFeed,
  getFeedDetail,
  FeedResponse,
  deleteFeedComment,
} from '@/apis/feed';

// 피드 데이터 조회
export const useFeed = () => {
  return useInfiniteQuery<
    FeedResponse,
    Error,
    FeedResponse,
    string[],
    string | undefined
  >({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => getFeed(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastCursor || undefined,
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
      queryClient.invalidateQueries({ queryKey: ['feedDetail'] });
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

// 피드 댓글 삭제
export const useDeleteFeedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedId,
      commentId,
    }: {
      feedId: number;
      commentId: number;
    }) => deleteFeedComment(feedId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedComments'] });
      queryClient.invalidateQueries({ queryKey: ['feedDetail'] });
    },
  });
};

// 피드 삭제
export const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: number) => deleteFeed(feedId),
    onSuccess: (_, feedId) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

// 피드 좋아요
export const useLikeFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: number) => likeFeed(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

// 피드 상세 페이지 조회
export const useFeedDetail = (feedId: number) => {
  return useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => getFeedDetail(feedId),
  });
};
