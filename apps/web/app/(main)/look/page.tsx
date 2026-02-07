import { Suspense } from 'react';
import { getLooksServer } from '@/shared/api/looks.server';
import { getClothesServer } from '@/shared/api/clothes.server';
import { LookPage } from '@/page/look/ui/LookPage';
import type { LookItem } from '@/shared/api/looks.types';
import type { ClothesItem } from '@/shared/api/clothes.types';

export default async function Page() {
  let looks: LookItem[] = [];
  let clothes: ClothesItem[] = [];

  try {
    [looks, clothes] = await Promise.all([
      getLooksServer(),
      getClothesServer(),
    ]);
  } catch { /* 비로그인 또는 API 미연결 시 빈 데이터 */ }

  return (
    <Suspense>
      <LookPage initialLooks={looks} initialClothes={clothes} />
    </Suspense>
  );
}
