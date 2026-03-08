import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/getEdgeCookieData';
import { createKyWithCookie } from '@/features/api/serverKy';
import { getLocationsApi, getLocationWeatherApi } from '@/shared/api/endpointTags/locations';
import { getRecommendationsLookApi } from '@/shared/api/endpointTags/recommendations';
import {
  HOME_LOCATIONS_CACHE_TAG,
  HOME_WEATHER_CACHE_TAG,
  HOME_RECOMMENDATION_CACHE_TAG,
} from '@/shared/api/cacheTags';
import type { Gender } from '@/shared/model/gender';

async function getTokenAndUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value ?? '';
  const userId = await getAccessTokenUserId();
  return { token, userId };
}

const _fetchLocations = unstable_cache(
  async (_cacheKey: string, token: string) =>
    getLocationsApi(createKyWithCookie(token ? `accessToken=${token}` : '')),
  [HOME_LOCATIONS_CACHE_TAG],
  { tags: [HOME_LOCATIONS_CACHE_TAG] },
);

const _fetchWeather = unstable_cache(
  async (_cacheKey: string, token: string, locationId: string) =>
    getLocationWeatherApi(createKyWithCookie(token ? `accessToken=${token}` : ''), locationId),
  [HOME_WEATHER_CACHE_TAG],
  { tags: [HOME_WEATHER_CACHE_TAG], revalidate: 1800 },
);

const _fetchRecommendation = unstable_cache(
  async (
    _cacheKey: string,
    token: string,
    latitude: string,
    longitude: string,
    gender: Gender,
  ) =>
    getRecommendationsLookApi(createKyWithCookie(token ? `accessToken=${token}` : ''), {
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      gender,
    }),
  [HOME_RECOMMENDATION_CACHE_TAG],
  { tags: [HOME_RECOMMENDATION_CACHE_TAG], revalidate: 3600 },
);

export async function getCachedHomeLocations() {
  const { token, userId } = await getTokenAndUserId();
  if (!userId) {
    return getLocationsApi(createKyWithCookie(token ? `accessToken=${token}` : ''));
  }
  return _fetchLocations(userId, token);
}

export async function getCachedHomeWeather(locationId: string) {
  const { token, userId } = await getTokenAndUserId();
  if (!userId) {
    return getLocationWeatherApi(
      createKyWithCookie(token ? `accessToken=${token}` : ''),
      locationId,
    );
  }
  return _fetchWeather(userId, token, locationId);
}

export async function getCachedHomeRecommendation(params: {
  latitude?: number;
  longitude?: number;
  gender: Gender;
}) {
  const { token, userId } = await getTokenAndUserId();
  const { latitude, longitude, gender } = params;
  if (!userId) {
    return getRecommendationsLookApi(
      createKyWithCookie(token ? `accessToken=${token}` : ''),
      params,
    );
  }
  return _fetchRecommendation(
    userId,
    token,
    String(latitude ?? ''),
    String(longitude ?? ''),
    gender,
  );
}
