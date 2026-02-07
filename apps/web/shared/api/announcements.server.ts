import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { AnnouncementListItem, AnnouncementDetail } from './announcements.types';
import { CACHE_TAGS } from './cache-tags';

export const getAnnouncementsServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get('announcements').json<AnnouncementListItem[]>();
    },
    ['announcements-list'],
    { tags: [CACHE_TAGS.ANNOUNCEMENTS], revalidate: 3600 }
  )();
};

export const getAnnouncementDetailServer = async (id: string) => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get(`announcements/${id}`).json<AnnouncementDetail>();
    },
    ['announcement-detail', id],
    { tags: [CACHE_TAGS.ANNOUNCEMENTS], revalidate: 3600 }
  )();
};
