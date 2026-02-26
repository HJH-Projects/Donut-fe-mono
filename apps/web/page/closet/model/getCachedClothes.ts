import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/kyCookieConfig';
import { createCachedKy } from '@/features/api/serverKy';
import { getClothesApi } from '@/shared/api/endpointTags/clothes';
import { CLOTHES_CACHE_TAG } from '@/app/(메인기능)/closet/page';

export async function getCachedClothes() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();

  return unstable_cache(
    () => getClothesApi(createCachedKy(token ? `accessToken=${token}` : '')),
    [CLOTHES_CACHE_TAG, userId ?? token],
    { tags: [CLOTHES_CACHE_TAG] },
  )();
}
