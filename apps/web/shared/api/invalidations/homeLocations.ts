'use server';

import { revalidateTag } from 'next/cache';

import { HOME_LOCATIONS_CACHE_TAG } from '@/shared/api/cacheTags';

export async function invalidateHomeLocations() {
  revalidateTag(HOME_LOCATIONS_CACHE_TAG, 'max');
}
