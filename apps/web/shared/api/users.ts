import { clientKy } from './client';
import { serverKy } from './server';

export type UserProfile = {
  id: string;
  nickname: string | null;
  email?: string;
  profileImg: string | null;
  isNewUser: boolean;
  createdAt: string;
};

export type UserStats = {
  closetCount: number;
  lookCount: number;
  grade: string;
  gradeProgress: number;
};

const mockProfile: UserProfile = {
  id: 'mock-user-id',
  nickname: 'donut',
  email: 'donut@example.com',
  profileImg: null,
  isNewUser: false,
  createdAt: new Date().toISOString(),
};

const mockStats: UserStats = {
  closetCount: 12,
  lookCount: 4,
  grade: 'Silver',
  gradeProgress: 0.6,
};

export const getMeServer = async () => {
  try {
    return await serverKy.get('users/me').json<UserProfile>();
  } catch {
    return mockProfile;
  }
};

export const getMeClient = async () => {
  try {
    return await clientKy.get('users/me').json<UserProfile>();
  } catch {
    return mockProfile;
  }
};

export const getUserStatsServer = async () => {
  return mockStats;
};

export const updateProfileClient = async (payload: { nickname?: string; profileImg?: string }) => {
  try {
    return await clientKy.patch('users/profile', { json: payload }).json<UserProfile>();
  } catch {
    return { ...mockProfile, ...payload };
  }
};

export const resetUserClient = async () => {
  try {
    return await clientKy.post('users/reset').json<{ success: boolean }>();
  } catch {
    return { success: true };
  }
};
