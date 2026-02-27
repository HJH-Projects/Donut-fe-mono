import { cookies } from 'next/headers';
import { MyPage } from '@/page/my/ui/MyPage';
import { getCachedProfile } from '@/page/my/model/getCachedProfile';
import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { getCachedLooks } from '@/page/look/model/getCachedLooks';
import { GENDER_COOKIE, type Gender } from '@/shared/model/gender';

export default async function Page() {
  const cookieStore = await cookies();
  const initialGender = (cookieStore.get(GENDER_COOKIE)?.value ?? 'FEMALE') as Gender;

  const [initialProfile, clothes, looks] = await Promise.all([
    getCachedProfile().catch(() => null),
    getCachedClothes().catch(() => []),
    getCachedLooks().catch(() => []),
  ]);

  const initialStats = {
    closetCount: clothes.length,
    lookCount: looks.length,
  };

  return (
    <MyPage
      initialProfile={initialProfile}
      initialStats={initialStats}
      initialGender={initialGender}
    />
  );
}
