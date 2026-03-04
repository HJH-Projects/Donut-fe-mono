'use server';

import { updateTag } from 'next/cache';

import { LOOKS_CACHE_TAG } from '@/shared/api/cacheTags';

export async function invalidateLooks() {
  updateTag(LOOKS_CACHE_TAG);
}
