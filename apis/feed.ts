import fetcher from '@/utils/fetcher';

export interface Feed {
  id: number;
  userId: number;
  userTeamId: number;
  nickName: string;
  profileUrl: string;
  userLevel: number;
  content: string;
  createdAt: string;
  images: string[];
  tagIds: number[];
  comments: number;
  likes: number;
  isLiked: number;
}

export interface FeedResponse {
  feed: Feed[];
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
export const getFeed = async (): Promise<FeedResponse> => {
  const response = await fetcher<FeedResponse>({
    url: '/feeds',
    method: 'GET',
  });
  console.log('피드 응답:', response.data);
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
  console.log('이미지 업로드 응답:', response.data);
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
