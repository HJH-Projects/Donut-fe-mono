'use client';

import { BottomNav } from '@/shared/ui/BottomNav';
import type { WeatherSnapshot } from '@/shared/api/locations';
import type { RecommendationResponse } from '@/shared/api/recommendations.types';
import { LocationConsentBanner } from './LocationConsentBanner';

type Props = {
  locationName?: string;
  weather?: WeatherSnapshot | null;
  recommendation?: RecommendationResponse | null;
  hasGeo: boolean;
};

export const HomePage = ({ locationName, weather, recommendation, hasGeo }: Props) => {
  const display = recommendation?.weather.display;

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Donut</h1>
      </header>

      <LocationConsentBanner initialHasGeo={hasGeo} />

      <section className="px-6">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">
            {display?.locationName ?? locationName ?? '위치 없음'}
          </p>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-3xl font-semibold text-gray-900">
              {display?.tempCurrent ?? weather?.tempCurrent ?? '--'}°
            </span>
            <span className="text-sm text-gray-500">
              최저 {display?.tempMin ?? weather?.tempMin ?? '--'}° · 최고{' '}
              {display?.tempMax ?? weather?.tempMax ?? '--'}°
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
            <span>날씨: {display?.sky ?? '정보 없음'}</span>
            <span>
              바람 {display?.wind ?? (weather?.windSpeed ? `${weather.windSpeed}m/s` : '--')}
            </span>
            <span>강수확률: {display?.precipitationProbability ?? '--'}</span>
          </div>
          <p className="mt-3 text-sm text-gray-700">
            {display?.message ?? recommendation?.recommendation.description ?? '오늘도 멋진 하루 보내세요.'}
          </p>
        </div>
      </section>

      <section className="mt-6 px-6">
        <div className="h-[60vh] w-full overflow-hidden rounded-3xl">
          {recommendation?.recommendation.lookImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recommendation.recommendation.lookImageUrl}
              alt="코디 이미지"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              이미지 준비 중
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
};
