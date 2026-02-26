'use server';

import { CLOTHES_CACHE_TAG } from '@/app/(메인기능)/closet/page';
import { revalidateTag } from 'next/cache';

export async function invalidateClothes() {
  revalidateTag(CLOTHES_CACHE_TAG, 'max');
}
