import { Suspense } from 'react';
import { getMeServer, getUserStatsServer } from '@/shared/api/users.server';
import { MyPage } from '@/page/my/ui/MyPage';
import type { UserProfile, UserStats } from '@/shared/api/users.types';

export default async function Page() {
  let profile: UserProfile | null = null;
  let stats: UserStats | null = null;

  try {
    [profile, stats] = await Promise.all([
      getMeServer(),
      getUserStatsServer(),
    ]);
  } catch { /* 비로그인 시 null */ }

  return (
    <Suspense>
      <MyPage initialProfile={profile} initialStats={stats} />
    </Suspense>
  );
}
