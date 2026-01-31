import { serverKy } from './server';
import type { LookItem } from './looks.types';

export const getLooksServer = async () => {
  return await serverKy.get('looks').json<LookItem[]>();
};

export const getLookDetailServer = async (id: string) => {
  return await serverKy.get(`looks/${id}`).json<LookItem>();
};
