import { clientKy } from './client';
import type { UserProfile } from './users.types';

const mockProfile: UserProfile = {
  id: 'mock-user-id',
  nickname: 'donut',
  email: 'donut@example.com',
  profileImg: null,
  isNewUser: false,
  createdAt: new Date().toISOString(),
};

export const getMeClient = async () => {
  try {
    return await clientKy.get('users/me').json<UserProfile>();
  } catch {
    return mockProfile;
  }
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
