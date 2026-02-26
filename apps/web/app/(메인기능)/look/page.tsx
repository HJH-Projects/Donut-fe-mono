import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { getCachedLooks } from '@/page/look/model/getCachedLooks';
import { LookPage } from '@/page/look/ui/LookPage';
import { PageHeader } from '@/shared/ui/PageHeader';

export const LOOKS_CACHE_TAG = 'looks';

export default async function Page() {
  const [initialLooks, initialClothes] = await Promise.all([
    getCachedLooks().catch(() => []),
    getCachedClothes().catch(() => []),
  ]);

  return (
    <LookPage
      initialLooks={initialLooks}
      initialClothes={initialClothes}
      header={<PageHeader title="Looks" titleHref="/look" />}
    />
  );
}
