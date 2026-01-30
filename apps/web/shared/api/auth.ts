import { clientKy } from './client';

export const logout = async () => {
  try {
    return await clientKy.post('auth/logout').json();
  } catch {
    return { success: true };
  }
};

export const refresh = async () => {
  try {
    return await clientKy.get('auth/refresh').json();
  } catch {
    return { success: true };
  }
};
