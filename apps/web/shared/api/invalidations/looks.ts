'use server';

import { revalidateTag } from 'next/cache';

import { LOOKS_CACHE_TAG } from '@/app/(메인기능)/look/page';

export async function invalidateLooks() {
  revalidateTag(LOOKS_CACHE_TAG, 'max');
}
