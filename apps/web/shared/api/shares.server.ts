import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { ShareLinkDetail } from './shares.types';
import { CACHE_TAGS } from './cache-tags';

export const getShareDetailServer = async (sharePath: string) => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get(`shares/${sharePath}`).json<ShareLinkDetail>();
    },
    ['share-detail', sharePath],
    { tags: [CACHE_TAGS.SHARES], revalidate: 600 }
  )();
};
