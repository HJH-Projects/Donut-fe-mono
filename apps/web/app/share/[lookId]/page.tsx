import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getShareDetailServer } from '@/shared/api/shares.server';
import { getShareCommentsServer } from '@/shared/api/comments.server';
import { SharedLookPage } from '@/page/share/ui/SharedLookPage';
import { BottomNav } from '@/shared/ui/BottomNav';
import type { ShareLinkDetail } from '@/shared/api/shares.types';
import type { CommentItem } from '@/shared/api/comments.types';

export default async function Page({ params }: { params: Promise<{ lookId: string }> }) {
  const { lookId: sharePath } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');

  let shareDetail: ShareLinkDetail | null = null;
  let comments: CommentItem[] = [];

  try {
    shareDetail = await getShareDetailServer(sharePath);
  } catch { /* 존재하지 않는 공유 링크 */ }

  try {
    comments = await getShareCommentsServer(sharePath);
  } catch { /* 댓글 로딩 실패 시 빈 배열 */ }

  return (
    <div className="relative min-h-screen bg-white">
      <Suspense>
        <SharedLookPage
          sharePath={sharePath}
          initialShareDetail={shareDetail}
          initialComments={comments}
          isLoggedIn={isLoggedIn}
        />
      </Suspense>
      <BottomNav />
    </div>
  );
}
