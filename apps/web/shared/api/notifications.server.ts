import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { NotificationItem } from './notifications.types';
import { CACHE_TAGS } from './cache-tags';

export const getNotificationsServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get('notifications').json<NotificationItem[]>();
    },
    ['notifications-list'],
    { tags: [CACHE_TAGS.NOTIFICATIONS], revalidate: 300 }
  )();
};
