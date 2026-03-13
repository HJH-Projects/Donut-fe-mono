import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SharedLookPage } from '@/page/share/ui/SharedLookPage';
import { BottomNav } from '@/shared/ui/BottomNav';
import { serverKy } from '@/features/api/serverKy';
import { getAccessTokenUserId } from '@/features/api/getEdgeCookieData';
import { getSharesDetailApi } from '@/shared/api/endpointTags/shares';
import { getShareCommentsApi } from '@/shared/api/endpointTags/comments';
import { getUsersMeApi } from '@/shared/api/endpointTags/users';
import type { ShareLinkDetailResponseDto } from '@/shared/model/orvalSchemas';

export const runtime = 'edge';

function getWebBaseUrl() {
  return (process.env.NEXT_PUBLIC_WEB_URL || 'https://doknot.xyz').replace(/\/+$/, '');
}

function getFirstLookImageUrl(detail: ShareLinkDetailResponseDto): string | undefined {
  const items = detail.look?.items ?? [];
  for (const item of items) {
    const imageCandidates = [item.images?.cardWebpUrl, item.images?.cardJpegUrl];
    const found = imageCandidates.find((url): url is string => !!url);
    if (found) return found;
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lookId: string }>;
}): Promise<Metadata> {
  const { lookId: sharePath } = await params;
  const detail = await getSharesDetailApi(serverKy, sharePath).catch(() => null);
  const shareUrl = `${getWebBaseUrl()}/share/${sharePath}`;

  if (!detail) {
    return {
      title: '룩 공유',
      description: '공유된 룩을 확인해보세요.',
      openGraph: {
        title: '룩 공유',
        description: '공유된 룩을 확인해보세요.',
        url: shareUrl,
        type: 'website',
      },
    };
  }

  const title = detail.look?.name || '룩 공유';
  const description = `${title} 룩을 확인해보세요.`;
  const imageUrl = getFirstLookImageUrl(detail);

  return {
    title,
    description,
    alternates: { canonical: shareUrl },
    openGraph: {
      title,
      description,
      url: shareUrl,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lookId: string }> }) {
  const { lookId: sharePath } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');
  const currentUserId = await getAccessTokenUserId();
  const currentUserNickname = isLoggedIn
    ? await getUsersMeApi(serverKy)
        .then((me) => me.nickname)
        .catch(() => null)
    : null;

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
        currentUserId={currentUserId}
        currentUserNickname={currentUserNickname}
      />
      <BottomNav />
    </div>
  );
}
