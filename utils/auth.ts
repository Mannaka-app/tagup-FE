import { KakaoTokenInfo } from '@/types/auth';

let tokenInfo: KakaoTokenInfo | null = null;

export const saveTokenInfo = async (info: KakaoTokenInfo): Promise<boolean> => {
  tokenInfo = info;
  return true;
};

export const getTokenInfo = async (): Promise<KakaoTokenInfo | null> => {
  return tokenInfo;
};

export const deleteTokenInfo = async (): Promise<void> => {
  tokenInfo = null;
};
