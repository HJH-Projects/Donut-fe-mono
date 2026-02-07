'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { NotificationItem } from '../notifications.types';

export async function markNotificationReadAction(id: string) {
  const result = await serverKy.patch(`notifications/${id}/read`).json<NotificationItem>();
  updateTag(CACHE_TAGS.NOTIFICATIONS);
  return result;
}
