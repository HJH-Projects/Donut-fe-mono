import { Suspense } from 'react';
import { NotificationsPage } from '@/page/notifications/ui/NotificationsPage';

export default function Page() {
  return (
    <Suspense>
      <NotificationsPage />
    </Suspense>
  );
}
