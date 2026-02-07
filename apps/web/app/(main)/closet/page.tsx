import { Suspense } from 'react';
import { getClothesServer } from '@/shared/api/clothes.server';
import { ClosetPage } from '@/page/closet/ui/ClosetPage';
import type { ClothesItem } from '@/shared/api/clothes.types';

export default async function Page() {
  let clothes: ClothesItem[] = [];

  try {
    clothes = await getClothesServer();
  } catch { /* 비로그인 또는 API 미연결 시 빈 데이터 */ }

  return (
    <Suspense>
      <ClosetPage initialClothes={clothes} />
    </Suspense>
  );
}
