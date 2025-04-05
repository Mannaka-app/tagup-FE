import fetcher from '@/utils/fetcher';
import { LoginResponse } from './auth';

export const uploadProfileImage = async (
  profileUrl: string
): Promise<LoginResponse> => {
  const response = await fetcher<LoginResponse>({
    url: '/users/profile-image',
    method: 'PUT',
    data: { profileUrl },
  });
  console.log('프로필 이미지 업로드 응답:', response.data);
  return response.data;
};

export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
}

export const uploadImage = async (
  file: FormData
): Promise<UploadImageResponse> => {
  const response = await fetcher<UploadImageResponse>({
    url: '/users/image',
    method: 'POST',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('이미지 업로드 응답:', response.data);
  return response.data;
};
