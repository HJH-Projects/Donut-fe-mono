'use server';

import { revalidateTag } from 'next/cache';

import { LOOKS_CACHE_TAG } from '@/shared/api/cacheTags';

export async function invalidateLooks() {
  revalidateTag(LOOKS_CACHE_TAG, 'max');
}
