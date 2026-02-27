import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/kyCookieConfig';
import { createCachedKy } from '@/features/api/serverKy';
import { getLooksApi } from '@/shared/api/endpointTags/looks';
import { LOOKS_CACHE_TAG } from '@/shared/api/cacheTags';

export async function getCachedLooks() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();

  return unstable_cache(
    () => getLooksApi(createCachedKy(token ? `accessToken=${token}` : '')),
    [LOOKS_CACHE_TAG, userId ?? token],
    { tags: [LOOKS_CACHE_TAG] },
  )();
}
