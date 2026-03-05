import { getCachedClothes } from '@/page/closet/model/getCachedClothes';
import { ClosetPage } from '@/page/closet/ui/ClosetPage';
import type { ClothesListItemResponseDto } from '@/shared/model/orvalSchemas';
import { PageHeader } from '@/shared/ui/PageHeader';

export default async function Page() {
  const initialClothes: ClothesListItemResponseDto[] = await getCachedClothes().catch(
    () => [] as ClothesListItemResponseDto[],
  );

  return (
    <ClosetPage
      initialClothes={initialClothes}
      header={<PageHeader title="Closet" titleHref="/closet" />}
    />
  );
}
