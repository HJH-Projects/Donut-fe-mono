import { AnnouncementDetailPage } from '@/page/announcements/ui/AnnouncementDetailPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AnnouncementDetailPage
      initialAnnouncement={null}
      header={
        <PageHeader
          title="공지사항"
          titleHref={`/announcements/${id}`}
          left={<HeaderBackLink href="/announcements" />}
        />
      }
    />
  );
}
