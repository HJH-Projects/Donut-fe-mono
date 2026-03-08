import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/getEdgeCookieData';
import { createKyWithCookie } from '@/features/api/serverKy';
import { getUsersMeApi } from '@/shared/api/endpointTags/users';
import { PROFILE_CACHE_TAG } from '@/shared/api/cacheTags';

const _fetchProfile = unstable_cache(
  async (_cacheKey: string, token: string) =>
    getUsersMeApi(createKyWithCookie(token ? `accessToken=${token}` : '')),
  [PROFILE_CACHE_TAG],
  { tags: [PROFILE_CACHE_TAG] },
);

export async function getCachedProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();

  if (!userId) {
    return getUsersMeApi(createKyWithCookie(token ? `accessToken=${token}` : ''));
  }

  return _fetchProfile(userId, token);
}
