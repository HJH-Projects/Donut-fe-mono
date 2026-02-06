'use client';

import { useState, useEffect, useRef } from 'react';
import { BottomNav } from '@/shared/ui/BottomNav';
import type { WeatherSnapshot, LocationItem } from '@/shared/api/locations.types';
import {
  getLocationsClient,
  createLocationClient,
  updateLocationClient,
  deleteLocationClient,
} from '@/shared/api/locations.client';
import type { RecommendationResponse } from '@/shared/api/recommendations.types';
import { LocationConsentBanner } from './LocationConsentBanner';

type Props = {
  locationName?: string;
  weather?: WeatherSnapshot | null;
  recommendation?: RecommendationResponse | null;
  hasGeo: boolean;
  initialLocations?: LocationItem[];
};

export const HomePage = ({
  locationName,
  weather,
  recommendation,
  hasGeo,
  initialLocations = [],
}: Props) => {
  const display = recommendation?.weather.display;
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [showPopover, setShowPopover] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [saving, setSaving] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
        setShowAddForm(false);
      }
    };
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopover]);

  const handleSelectLocation = async (loc: LocationItem) => {
    try {
      await updateLocationClient(loc.id, { isDefault: true });
      const updated = await getLocationsClient();
      setLocations(updated);
      setShowPopover(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('위치 변경에 실패했습니다.');
    }
  };

  const handleAddLocation = async () => {
    if (!newAlias.trim()) return;
    if (!navigator.geolocation) {
      alert('위치 정보를 사용할 수 없습니다.');
      return;
    }
    setSaving(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await createLocationClient({
            name: newAlias.trim(),
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            alias: newAlias.trim(),
            isDefault: locations.length === 0,
          });
          const updated = await getLocationsClient();
          setLocations(updated);
          setNewAlias('');
          setShowAddForm(false);
          setSaving(false);
        } catch (error) {
          console.error(error);
          alert('위치 추가에 실패했습니다.');
          setSaving(false);
        }
      },
      () => {
        alert('위치 정보를 가져올 수 없습니다.');
        setSaving(false);
      }
    );
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('이 위치를 삭제하시겠습니까?')) return;
    try {
      await deleteLocationClient(id);
      const updated = await getLocationsClient();
      setLocations(updated);
    } catch (error) {
      console.error(error);
      alert('위치 삭제에 실패했습니다.');
    }
  };

  const defaultLocation = locations.find((loc) => loc.isDefault);
  const displayLocationName =
    display?.locationName ?? defaultLocation?.alias ?? locationName ?? '위치 없음';

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Donut</h1>
      </header>

      <LocationConsentBanner initialHasGeo={hasGeo} />

      <section className="px-6">
        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="relative flex items-center gap-2">
            <p className="text-sm text-gray-500">{displayLocationName}</p>
            <button
              type="button"
              onClick={() => setShowPopover((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="위치 설정"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {showPopover && (
              <div
                ref={popoverRef}
                className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">내 위치</span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    + 추가
                  </button>
                </div>

                {showAddForm && (
                  <div className="mb-3 flex gap-2">
                    <input
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      placeholder="위치 이름"
                      className="h-8 flex-1 rounded-lg border border-gray-200 px-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      disabled={saving}
                      className="rounded-lg bg-black px-3 text-xs text-white disabled:opacity-50"
                    >
                      {saving ? '...' : '저장'}
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  {locations.length === 0 && (
                    <p className="py-2 text-center text-xs text-gray-400">등록된 위치가 없습니다</p>
                  )}
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`flex items-center justify-between rounded-lg px-2 py-2 ${
                        loc.isDefault ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectLocation(loc)}
                        className="flex-1 text-left text-sm text-gray-700"
                      >
                        {loc.alias}
                        {loc.isDefault && (
                          <span className="ml-2 text-xs text-blue-600">기본</span>
                        )}
                      </button>
                      {!loc.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLocation(loc.id)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          aria-label="삭제"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
