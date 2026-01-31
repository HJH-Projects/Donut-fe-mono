import { clientKy } from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getGoogleAuthUrl = () => `${API_BASE_URL}/auth/google`;

export const getKakaoAuthUrl = () => `${API_BASE_URL}/auth/kakao`;

export const logout = async () => {
  return await clientKy.post('auth/logout').json<{ success: boolean }>();
};

export const refresh = async () => {
  return await clientKy.get('auth/refresh').json<{ success: boolean }>();
};
