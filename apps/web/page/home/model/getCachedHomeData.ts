import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessTokenUserId } from '@/features/api/kyCookieConfig';
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

export async function getCachedHomeLocations() {
  const { token, userId } = await getTokenAndUserId();
  return unstable_cache(
    () => getLocationsApi(createKyWithCookie(token ? `accessToken=${token}` : '')),
    [HOME_LOCATIONS_CACHE_TAG, userId ?? token],
    { tags: [HOME_LOCATIONS_CACHE_TAG] },
  )();
}

export async function getCachedHomeWeather(locationId: string) {
  const { token, userId } = await getTokenAndUserId();
  return unstable_cache(
    () => getLocationWeatherApi(createKyWithCookie(token ? `accessToken=${token}` : ''), locationId),
    [HOME_WEATHER_CACHE_TAG, locationId, userId ?? token],
    { tags: [HOME_WEATHER_CACHE_TAG], revalidate: 1800 },
  )();
}

export async function getCachedHomeRecommendation(params: {
  latitude?: number;
  longitude?: number;
  gender: Gender;
}) {
  const { token, userId } = await getTokenAndUserId();
  const { latitude, longitude, gender } = params;
  return unstable_cache(
    () => getRecommendationsLookApi(createKyWithCookie(token ? `accessToken=${token}` : ''), params),
    [HOME_RECOMMENDATION_CACHE_TAG, String(latitude ?? ''), String(longitude ?? ''), gender, userId ?? token],
    { tags: [HOME_RECOMMENDATION_CACHE_TAG], revalidate: 3600 },
  )();
}
