'use server';

import { CLOTHES_CACHE_TAG } from '@/shared/api/cacheTags';
import { revalidateTag } from 'next/cache';

export async function invalidateClothes() {
  revalidateTag(CLOTHES_CACHE_TAG, 'max');
}
