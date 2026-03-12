import { AnnouncementDetailPage } from '@/page/announcements/ui/AnnouncementDetailPage';
import { serverKy } from '@/features/api/serverKy';
import { getAnnouncementByIdApi } from '@/shared/api/endpointTags/announcements';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialAnnouncement = await getAnnouncementByIdApi(serverKy, id)
    .then((res) => ({
      id: res.id,
      title: res.title,
      content: res.body,
      date: (res.publishedAt || res.createdAt || '').slice(0, 10),
      imageUrls: res.images?.bodyImageUrl
        ? [res.images.bodyImageUrl]
        : res.images?.previewImageUrl
          ? [res.images.previewImageUrl]
          : [],
    }))
    .catch(() => null);

  return (
    <AnnouncementDetailPage
      initialAnnouncement={initialAnnouncement}
      header={
        <PageHeader
          title="공지사항"
          titleHref={`/announcements/${id}`}
          left={<HeaderBackLink href="/announcements" disableHover />}
        />
      }
    />
  );
}
