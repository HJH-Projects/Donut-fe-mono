import { serverKy } from './server';
import type { UserProfile, UserStats } from './users.types';

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

export const getUserStatsServer = async () => {
  return mockStats;
};
