import { serverKy } from './server';
import type { LocationItem, WeatherSnapshot } from './locations.types';

export const getLocationsServer = async () => {
  try {
    return await serverKy.get('locations').json<LocationItem[]>();
  } catch {
    return [];
  }
};

export const getWeatherByLocationServer = async (id: string) => {
  try {
    return await serverKy.get(`locations/${id}/weather`).json<WeatherSnapshot>();
  } catch {
    return null;
  }
};
