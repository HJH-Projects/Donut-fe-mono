import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { CommentItem } from './comments.types';
import { CACHE_TAGS } from './cache-tags';

export const getShareCommentsServer = async (sharePath: string) => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get(`shares/${sharePath}/comments`).json<CommentItem[]>();
    },
    ['share-comments', sharePath],
    { tags: [CACHE_TAGS.COMMENTS], revalidate: 300 }
  )();
};
