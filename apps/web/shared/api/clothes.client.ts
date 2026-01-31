import { clientKy } from './client';
import type { ClothesDetail, ClothesItem } from './clothes.types';

export const getClothesClient = async () => {
  return await clientKy.get('clothes').json<ClothesItem[]>();
};

export const updateClothesClient = async (id: string, payload: Partial<ClothesDetail>) => {
  return await clientKy.patch(`clothes/${id}`, { json: payload }).json<ClothesDetail>();
};

export const createClothesClient = async (payload: {
  title: string;
  category: ClothesItem['category'];
  color: string;
  imageUrl: string;
}) => {
  return await clientKy.post('clothes', { json: payload }).json<ClothesItem>();
};
