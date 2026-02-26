import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { ClosetPage } from '@/page/closet/ui/ClosetPage';
import { PageHeader } from '@/shared/ui/PageHeader';

export const CLOTHES_CACHE_TAG = 'clothes';

export default async function Page() {
  const initialClothes = await getCachedClothes().catch(() => []);

  return (
    <ClosetPage
      initialClothes={initialClothes}
      header={<PageHeader title="Closet" titleHref="/closet" />}
    />
  );
}
