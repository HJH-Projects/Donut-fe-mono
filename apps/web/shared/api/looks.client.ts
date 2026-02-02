import { clientKy } from './client';
import type { LookItem } from './looks.types';

export const getLooksClient = async () => {
  return await clientKy.get('looks').json<LookItem[]>();
};

export const createLookClient = async (payload: {
  name: string;
  tags: string;
  items: Array<{ clothesId: string; sortOrder: number; role: string }>;
}) => {
  return await clientKy.post('looks', { json: payload }).json<LookItem>();
};

export const updateLookClient = async (
  id: string,
  payload: {
    name?: string;
    tags?: string;
    items?: Array<{ clothesId: string; sortOrder: number; role: string }>;
  }
) => {
  return await clientKy.patch(`looks/${id}`, { json: payload }).json<LookItem>();
};

export const deleteLookClient = async (id: string) => {
  return await clientKy.delete(`looks/${id}`).json<{ id: string; deletedAt: string }>();
};
