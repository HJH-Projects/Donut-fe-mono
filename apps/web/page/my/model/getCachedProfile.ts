import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/kyCookieConfig';
import { createKyWithCookie } from '@/features/api/serverKy';
import { getUsersMeApi } from '@/shared/api/endpointTags/users';
import { PROFILE_CACHE_TAG } from '@/shared/api/cacheTags';

export async function getCachedProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();

  return unstable_cache(
    () => getUsersMeApi(createKyWithCookie(token ? `accessToken=${token}` : '')),
    [PROFILE_CACHE_TAG, userId ?? token],
    { tags: [PROFILE_CACHE_TAG] },
  )();
}
