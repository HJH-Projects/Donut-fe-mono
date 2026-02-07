import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { LookItem } from './looks.types';
import { CACHE_TAGS } from './cache-tags';

export const getLooksServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get('looks').json<LookItem[]>();
    },
    ['looks-list'],
    { tags: [CACHE_TAGS.LOOKS], revalidate: 600 }
  )();
};

export const getLookDetailServer = async (id: string) => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get(`looks/${id}`).json<LookItem>();
    },
    ['looks-detail', id],
    { tags: [CACHE_TAGS.LOOKS], revalidate: 1800 }
  )();
};
