'use server';

import { revalidateTag } from 'next/cache';

import { PROFILE_CACHE_TAG } from '@/app/(메인기능)/my/page';

export async function invalidateProfile() {
  revalidateTag(PROFILE_CACHE_TAG, 'max');
}
