export interface UserDetailDto {
  nickname: string;
  gender: 'MALE' | 'FEMALE';
}

export interface TeamResponse {
  success: boolean;
  message: string;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  emoji: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  authProvider: string;
  profileUrl: string | null;
  gender: 'MALE' | 'FEMALE';
  team: number;
  createdAt: string;
  teamSeletedAt: string | null;
  winningRate: number | null;
  level: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface KakaoTokenInfo {
  idToken: string;
}
