import { AnnouncementsPage } from '@/page/announcements/ui/AnnouncementsPage';
import { serverKy } from '@/features/api/serverKy';
import { getAnnouncementsApi } from '@/shared/api/endpointTags/announcements';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page() {
  const initialAnnouncements = await getAnnouncementsApi(serverKy, {
    limit: 20,
  })
    .then((res) =>
      res.items.map((item) => ({
        id: item.id,
        title: item.title,
        date: (item.publishedAt || item.createdAt || '').slice(0, 10),
        imageUrl: item.images?.previewImageUrl || item.images?.bodyImageUrl || '',
      })),
    )
    .catch(() => []);

  return (
    <AnnouncementsPage
      initialAnnouncements={initialAnnouncements}
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
