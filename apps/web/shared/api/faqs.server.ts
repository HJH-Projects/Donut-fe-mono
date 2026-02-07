import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { FAQItem } from './faqs.types';
import { CACHE_TAGS } from './cache-tags';

export const getFaqsServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get('faqs').json<FAQItem[]>();
    },
    ['faqs-list'],
    { tags: [CACHE_TAGS.FAQS], revalidate: 3600 }
  )();
};
