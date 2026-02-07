'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { ClothesItem, ClothesDetail } from '../clothes.types';

export async function createClothesAction(payload: {
  title: string;
  category: ClothesItem['category'];
  color: string;
  imageUrl: string;
}) {
  const result = await serverKy.post('clothes', { json: payload }).json<ClothesItem>();
  updateTag(CACHE_TAGS.CLOTHES);
  updateTag(CACHE_TAGS.USER_STATS);
  return result;
}

export async function updateClothesAction(
  id: string,
  payload: {
    title?: string;
    category?: ClothesItem['category'];
    color?: string;
    imageUrl?: string;
  }
) {
  const result = await serverKy.patch(`clothes/${id}`, { json: payload }).json<ClothesDetail>();
  updateTag(CACHE_TAGS.CLOTHES);
  return result;
}

export async function deleteClothesAction(id: string) {
  const result = await serverKy.delete(`clothes/${id}`).json<{ id: string; deletedAt: string }>();
  updateTag(CACHE_TAGS.CLOTHES);
  updateTag(CACHE_TAGS.USER_STATS);
  return result;
}

export async function toggleClothesFavoriteAction(id: string) {
  const result = await serverKy.post(`clothes/${id}/favorite`).json<ClothesItem>();
  updateTag(CACHE_TAGS.CLOTHES);
  return result;
}
