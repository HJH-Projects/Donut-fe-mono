'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { LookItem } from '../looks.types';

export async function createLookAction(payload: {
  name: string;
  tags: string;
  items: Array<{ clothesId: string; sortOrder: number; role: string }>;
}) {
  const result = await serverKy.post('looks', { json: payload }).json<LookItem>();
  updateTag(CACHE_TAGS.LOOKS);
  updateTag(CACHE_TAGS.USER_STATS);
  return result;
}

export async function updateLookAction(
  id: string,
  payload: {
    name?: string;
    tags?: string;
    items?: Array<{ clothesId: string; sortOrder: number; role: string }>;
  }
) {
  const result = await serverKy.patch(`looks/${id}`, { json: payload }).json<LookItem>();
  updateTag(CACHE_TAGS.LOOKS);
  return result;
}

export async function deleteLookAction(id: string) {
  const result = await serverKy.delete(`looks/${id}`).json<{ id: string; deletedAt: string }>();
  updateTag(CACHE_TAGS.LOOKS);
  updateTag(CACHE_TAGS.USER_STATS);
  return result;
}

export async function toggleLookFavoriteAction(id: string) {
  const result = await serverKy.post(`looks/${id}/favorite`).json<LookItem>();
  updateTag(CACHE_TAGS.LOOKS);
  return result;
}
