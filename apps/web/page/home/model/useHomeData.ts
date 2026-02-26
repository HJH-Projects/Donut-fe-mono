'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import type { WeatherResponseDto } from '@/shared/model/orvalSchemas';
import type { HomeLocation } from '@/app/(메인기능)/(home)/fetchHomeData';
import {
  getLocationWeatherApi,
  patchLocationsApi,
} from '@/shared/api/endpointTags/locations';
import { getRecommendationsLookApi } from '@/shared/api/endpointTags/recommendations';
import { clientKy } from '@/features/api/clientKy';
import type { HomeWeatherState, HomeRecommendation, HomeLocationOption } from '../ui/home.types';
import { toWeatherState } from './toWeatherData';

const DEFAULT_WEATHER: HomeWeatherState = {
  temp: 18,
  condition: 'cloudy',
  location: '서울',
  maxTemp: 22,
  minTemp: 14,
  windSpeed: 2.5,
  precipitation: 20,
  humidity: 65,
  tips: ['가벼운 니트와 데님으로 레이어링하기 좋은 날씨예요'],
};

const DEFAULT_RECOMMENDATION: HomeRecommendation = {
  imageUrl: null,
  description: null,
};

function toLocationOptions(locations: HomeLocation[]): HomeLocationOption[] {
  return locations.map((loc) => ({
    id: loc.id,
    locationId: loc.location.id,
    alias: loc.alias,
    lat: loc.location.lat,
    lon: loc.location.lon,
  }));
}

interface UseHomeDataOptions {
  isLoggedIn: boolean;
  initialWeather?: WeatherResponseDto | null;
  initialRecommendation?: HomeRecommendation | null;
  initialLocations?: HomeLocation[];
}

export function useHomeData({
  isLoggedIn,
  initialWeather = null,
  initialRecommendation = null,
  initialLocations = [],
}: UseHomeDataOptions) {
  const defaultLocation = initialLocations.find((loc) => loc.isDefault) || null;

  const [weather, setWeather] = useState<HomeWeatherState>(() => {
    if (initialWeather) {
      return toWeatherState(initialWeather, defaultLocation?.alias);
    }
    return DEFAULT_WEATHER;
  });

  const [recommendation, setRecommendation] = useState<HomeRecommendation>(
    () => initialRecommendation || DEFAULT_RECOMMENDATION,
  );

  const [locations, setLocations] = useState<HomeLocationOption[]>(
    () => toLocationOptions(initialLocations),
  );

  const [isLoading, setIsLoading] = useState(false);

  const fetchLocationData = useCallback(
    async (locationId: string, locationName: string, lat: number, lon: number) => {
      setWeather((prev) => ({ ...prev, location: locationName }));
      setIsLoading(true);
      try {
        const [snapshot, lookResult] = await Promise.all([
          getLocationWeatherApi(clientKy, locationId).catch(() => null),
          getRecommendationsLookApi(clientKy, { latitude: lat, longitude: lon }).catch(() => null),
        ]);

        if (snapshot) {
          setWeather(toWeatherState(snapshot, locationName));
        }
        if (lookResult) {
          setRecommendation({
            imageUrl: lookResult.recommendation?.lookImageUrl ?? null,
            description: lookResult.recommendation?.description ?? null,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const selectLocation = useCallback(
    async (loc: HomeLocationOption) => {
      if (loc.id) {
        patchLocationsApi(clientKy, loc.id, { isDefault: true }).catch(() => {});
      }
      await fetchLocationData(loc.locationId, loc.alias, loc.lat, loc.lon);
    },
    [fetchLocationData],
  );

  const updateDisplayedLocationAlias = useCallback(
    (prevAlias: string, nextAlias: string) => {
      setWeather((prev) => {
        if (prev.location !== prevAlias) return prev;
        return { ...prev, location: nextAlias };
      });
    },
    [],
  );

  // 서버에서 날씨를 못 가져온 경우 클라이언트에서 재시도
  useEffect(() => {
    if (!defaultLocation || initialWeather) return;
    fetchLocationData(
      defaultLocation.location.id,
      defaultLocation.alias,
      defaultLocation.location.lat,
      defaultLocation.location.lon,
    );
  }, [defaultLocation, fetchLocationData, initialWeather]);

  return {
    weather,
    recommendation,
    locations,
    isLoading,
    selectLocation,
    updateDisplayedLocationAlias,
    setLocations,
  };
}
