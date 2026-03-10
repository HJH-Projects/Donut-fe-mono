import { NotificationsPage } from '@/page/notifications/ui/NotificationsPage';
import { serverKy } from '@/features/api/serverKy';
import {
  getNotificationsApi,
  getNotificationsUnreadCountApi,
} from '@/shared/api/endpointTags/notifications';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page() {
  const [notificationsResult, unreadResult] = await Promise.all([
    getNotificationsApi(serverKy, {
      limit: 20,
    }).catch(() => ({ items: [], nextCursor: null })),
    getNotificationsUnreadCountApi(serverKy).catch(() => ({ unreadCount: 0 })),
  ]);

  return (
    <NotificationsPage
      initialNotifications={notificationsResult.items}
      initialNextCursor={notificationsResult.nextCursor}
      initialUnreadCount={unreadResult.unreadCount}
      header={
        <PageHeader
          title="알림"
          titleHref="/notifications"
          left={<HeaderBackLink href="/my" />}
        />
      }
    />
  );
}
