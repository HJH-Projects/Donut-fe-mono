import { clientKy } from './client';
import type { UserProfile } from './users.types';

export const getMeClient = async () => {
  return await clientKy.get('users/me').json<UserProfile>();
};

export const updateProfileClient = async (payload: { nickname?: string; profileImg?: string }) => {
  return await clientKy.patch('users/profile', { json: payload }).json<UserProfile>();
};

export const resetUserClient = async () => {
  return await clientKy.post('users/reset').json<{ success: boolean }>();
};
