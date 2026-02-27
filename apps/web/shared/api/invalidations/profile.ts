'use server';

import { revalidateTag } from 'next/cache';

import { PROFILE_CACHE_TAG } from '@/shared/api/cacheTags';

export async function invalidateProfile() {
  revalidateTag(PROFILE_CACHE_TAG, 'max');
}
