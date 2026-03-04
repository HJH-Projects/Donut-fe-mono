'use server';

import { CLOTHES_CACHE_TAG } from '@/shared/api/cacheTags';
import { updateTag } from 'next/cache';

export async function invalidateClothes() {
  updateTag(CLOTHES_CACHE_TAG);
}
