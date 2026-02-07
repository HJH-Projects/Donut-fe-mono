import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies, serverKy } from './server';
import type { LocationItem, WeatherSnapshot } from './locations.types';
import { CACHE_TAGS } from './cache-tags';

export const getLocationsServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      try {
        const ky = createCachedKy(cookieString);
        return await ky.get('locations').json<LocationItem[]>();
      } catch {
        return [];
      }
    },
    ['locations-list'],
    { tags: [CACHE_TAGS.LOCATIONS], revalidate: 3600 }
  )();
};

export const getWeatherByLocationServer = async (id: string) => {
  try {
    return await serverKy.get(`locations/${id}/weather`).json<WeatherSnapshot>();
  } catch {
    return null;
  }
};
