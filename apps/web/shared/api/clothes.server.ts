import { serverKy } from './server';
import type { ClothesDetail, ClothesItem } from './clothes.types';

export const getClothesServer = async () => {
  return await serverKy.get('clothes').json<ClothesItem[]>();
};

export const getClothesDetailServer = async (id: string) => {
  return await serverKy.get(`clothes/${id}`).json<ClothesDetail>();
};
