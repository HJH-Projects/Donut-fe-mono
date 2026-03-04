import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { MyPage } from '@/page/my/ui/MyPage';
import { MyPageSkeleton } from '@/page/my/ui/MyPageSkeleton';
import { getCachedProfile } from '@/page/my/model/getCachedProfile';
import { GENDER_COOKIE, type Gender } from '@/shared/model/gender';

export default async function Page() {
  const cookieStore = await cookies();
  const initialGender = (cookieStore.get(GENDER_COOKIE)?.value ?? 'FEMALE') as Gender;

  return (
    <Suspense fallback={<MyPageSkeleton initialGender={initialGender} />}>
      <MyPageLoader initialGender={initialGender} />
    </Suspense>
  );
}

async function MyPageLoader({ initialGender }: { initialGender: Gender }) {
  const initialProfile = await getCachedProfile().catch(() => null);

  return (
    <MyPage
      initialProfile={initialProfile}
      initialGender={initialGender}
    />
  );
}
