import { clientKy } from './client';
import { serverKy } from './server';

export type UserProfile = {
  id: string;
  nickname: string | null;
  profileImg: string | null;
  isNewUser: boolean;
  createdAt: string;
};

const mockUser: UserProfile = {
  id: 'mock-user-id',
  nickname: 'donut',
  profileImg: null,
  isNewUser: false,
  createdAt: new Date().toISOString(),
};

export const getMeClient = async () => {
  try {
    return await clientKy.get('users/me').json<UserProfile>();
  } catch {
    return mockUser;
  }
};

export const getMeServer = async () => {
  try {
    return await serverKy.get('users/me').json<UserProfile>();
  } catch {
    return mockUser;
  }
};
