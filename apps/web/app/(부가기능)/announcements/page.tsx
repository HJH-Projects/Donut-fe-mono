import { AnnouncementsPage } from '@/page/announcements/ui/AnnouncementsPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page() {
  return (
    <AnnouncementsPage
      initialAnnouncements={[]}
      header={
        <PageHeader
          title="공지사항"
          titleHref="/announcements"
          left={<HeaderBackLink href="/my" />}
        />
      }
    />
  );
}
