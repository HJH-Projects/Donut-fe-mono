import { Suspense } from 'react';
import { getNotificationsServer } from '@/shared/api/notifications.server';
import { NotificationsPage } from '@/page/notifications/ui/NotificationsPage';
import type { NotificationItem } from '@/shared/api/notifications.types';

export default async function Page() {
  let notifications: NotificationItem[] = [];

  try {
    notifications = await getNotificationsServer();
  } catch { /* API 미연동 시 빈 배열 */ }

  return (
    <Suspense>
      <NotificationsPage initialNotifications={notifications} />
    </Suspense>
  );
}
