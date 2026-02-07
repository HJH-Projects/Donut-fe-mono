import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getLocationsServer } from '@/shared/api/locations.server';
import { recommendLookServer } from '@/shared/api/recommendations.server';
import { HomePage } from '@/page/home/ui/HomePage';
import type { LocationItem } from '@/shared/api/locations.types';
import type { RecommendationResponse } from '@/shared/api/recommendations.types';

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('accessToken');

  let locations: LocationItem[] = [];
  let recommendation: RecommendationResponse | null = null;

  try {
    [locations, recommendation] = await Promise.all([
      getLocationsServer(),
      recommendLookServer(),
    ]);
  } catch { /* 비로그인 또는 API 미연결 시 빈 데이터 */ }

  const defaultLocation = locations.find(l => l.isDefault) ?? locations[0] ?? null;

  return (
    <Suspense>
      <HomePage
        initialLocations={locations}
        initialRecommendation={recommendation}
        defaultLocation={defaultLocation}
        isLoggedIn={isLoggedIn}
      />
    </Suspense>
  );
}
