import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/getEdgeCookieData';
import { createKyWithCookie } from '@/features/api/serverKy';
import { getClothesApi } from '@/shared/api/endpointTags/clothes';
import { CLOTHES_CACHE_TAG } from '@/shared/api/cacheTags';

const _fetchClothes = unstable_cache(
  async (_cacheKey: string, token: string) =>
    getClothesApi(createKyWithCookie(token ? `accessToken=${token}` : '')),
  [CLOTHES_CACHE_TAG],
  { tags: [CLOTHES_CACHE_TAG] },
);

export async function getCachedClothes() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();

  if (!userId) {
    return getClothesApi(createKyWithCookie(token ? `accessToken=${token}` : ''));
  }

  return _fetchClothes(userId, token);
}
