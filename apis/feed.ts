import fetcher from '@/utils/fetcher';

export interface Feed {
  id: number;
  image: string;
}

export interface FeedResponse {
  feed: Feed[];
  lastCursor: string;
}

export interface CreateFeedRequest {
  content: string;
  imageUrls: string[];
}

export interface CreateFeedResponse {
  success: boolean;
  message: string;
}

// 피드 목록 조회
export const getFeed = async (cursor?: string): Promise<FeedResponse> => {
  const response = await fetcher<FeedResponse>({
    url: '/feeds',
    method: 'GET',
    params: cursor ? { cursor } : undefined,
  });
  console.log(response.data);
  return response.data;
};

// 피드 생성
export const createFeed = async (
  data: CreateFeedRequest
): Promise<CreateFeedResponse> => {
  const response = await fetcher<CreateFeedResponse>({
    url: '/feeds',
    method: 'POST',
    data,
  });
  return response.data;
};

export interface PostFeedImgResponse {
  success: boolean;
  imageUrl: string;
}

// 피드 이미지 업로드
export const postFeedImg = async (
  file: FormData
): Promise<PostFeedImgResponse> => {
  const response = await fetcher<PostFeedImgResponse>({
    url: '/feeds/image',
    method: 'POST',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export interface PostFeedCommentRequest {
  content: string;
  feedId: number;
}

export interface PostFeedCommentResponse {
  success: boolean;
  message: string;
}

// 피드 댓글 작성
export const postFeedComment = async (
  data: PostFeedCommentRequest
): Promise<PostFeedCommentResponse> => {
  const response = await fetcher<PostFeedCommentResponse>({
    url: `/feeds/${data.feedId}/comments`,
    method: 'POST',
    data,
  });
  return response.data;
};

export interface FeedComment {
  id: number;
  userId: number;
  nickName: string;
  profileUrl: string;
  userLevel: number;
  content: string;
  createdAt: string;
}

// 피드 댓글 조회
export interface GetFeedCommentsResponse {
  comment: FeedComment[];
}

// 피드 댓글 조회
export const getFeedComments = async (
  feedId: number
): Promise<GetFeedCommentsResponse> => {
  const response = await fetcher<GetFeedCommentsResponse>({
    url: `/feeds/${feedId}/comments`,
    method: 'GET',
  });
  return response.data;
};

export interface DeleteFeedCommentResponse {
  success: boolean;
  message: string;
}

export const deleteFeedComment = async (
  feedId: number,
  commentId: number
): Promise<DeleteFeedCommentResponse> => {
  const response = await fetcher<DeleteFeedCommentResponse>({
    url: `/feeds/${feedId}/comments/${commentId}`,
    method: 'DELETE',
  });
  return response.data;
};

// 피드 삭제
export const deleteFeed = async (feedId: number): Promise<void> => {
  const response = await fetcher<void>({
    url: `/feeds/${feedId}`,
    method: 'DELETE',
  });
  return response.data;
};

// 피드 좋아요
export const likeFeed = async (feedId: number): Promise<void> => {
  const response = await fetcher<void>({
    url: `/feeds/${feedId}/likes`,
    method: 'POST',
  });
  return response.data;
};

// 피드 상세 페이지
export interface FeedDetail {
  id: number;
  userId: number;
  userTeamId: number;
  nickName: string;
  profileUrl: string;
  userLevel: number;
  content: string;
  createdAt: string;
  images: string[];
  comments: number;
  likes: number;
  isLiked: boolean;
}

export interface GetFeedDetailResponse {
  success: boolean;
  feed: FeedDetail;
}

// 피드 상세 페이지 조회
export const getFeedDetail = async (
  feedId: number
): Promise<GetFeedDetailResponse> => {
  const response = await fetcher<GetFeedDetailResponse>({
    url: `/feeds/${feedId}`,
    method: 'GET',
  });
  return response.data;
};
