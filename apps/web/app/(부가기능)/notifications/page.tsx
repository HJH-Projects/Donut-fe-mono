import { NotificationsPage } from '@/page/notifications/ui/NotificationsPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page() {
  return (
    <NotificationsPage
      initialNotifications={[]}
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
