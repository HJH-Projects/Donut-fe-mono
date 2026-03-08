import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/getEdgeCookieData';
import { createKyWithCookie } from '@/features/api/serverKy';
import { getLooksApi } from '@/shared/api/endpointTags/looks';
import { LOOKS_CACHE_TAG } from '@/shared/api/cacheTags';

const _fetchLooks = unstable_cache(
  async (_cacheKey: string, token: string) =>
    getLooksApi(createKyWithCookie(token ? `accessToken=${token}` : '')),
  [LOOKS_CACHE_TAG],
  { tags: [LOOKS_CACHE_TAG] },
);

export async function getCachedLooks() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();

  if (!userId) {
    return getLooksApi(createKyWithCookie(token ? `accessToken=${token}` : ''));
  }

  return _fetchLooks(userId, token);
}
