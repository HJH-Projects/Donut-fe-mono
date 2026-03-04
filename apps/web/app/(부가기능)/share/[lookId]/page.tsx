import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SharedLookPage } from '@/page/share/ui/SharedLookPage';
import { BottomNav } from '@/shared/ui/BottomNav';
import { serverKy } from '@/features/api/serverKy';
import { getSharesDetailApi } from '@/shared/api/endpointTags/shares';
import { getShareCommentsApi } from '@/shared/api/endpointTags/comments';

export default async function Page({ params }: { params: Promise<{ lookId: string }> }) {
  const { lookId: sharePath } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');

  const initialShareDetail = await getSharesDetailApi(serverKy, sharePath).catch(() => null);
  if (!initialShareDetail) {
    notFound();
  }

  const initialComments = await getShareCommentsApi(serverKy, sharePath).catch(() => []);

  return (
    <div className="relative min-h-screen bg-white">
      <SharedLookPage
        sharePath={sharePath}
        initialShareDetail={initialShareDetail}
        initialComments={initialComments}
        isLoggedIn={isLoggedIn}
      />
      <BottomNav />
    </div>
  );
}
