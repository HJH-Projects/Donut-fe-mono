import { clientKy } from './client';
import type { LocationItem, WeatherSnapshot, CreateLocationPayload } from './locations.types';

export const getLocationsClient = async () => {
  try {
    return await clientKy.get('locations').json<LocationItem[]>();
  } catch {
    return [];
  }
};

export const getWeatherByLocationClient = async (id: string) => {
  try {
    return await clientKy.get(`locations/${id}/weather`).json<WeatherSnapshot>();
  } catch {
    return null;
  }
};

export const createLocationClient = async (payload: CreateLocationPayload) => {
  return await clientKy.post('locations', { json: payload }).json<LocationItem>();
};

export const updateLocationClient = async (
  id: string,
  payload: { alias?: string; isDefault?: boolean }
) => {
  return await clientKy.patch(`locations/${id}`, { json: payload }).json<LocationItem>();
};

export const deleteLocationClient = async (id: string) => {
  return await clientKy.delete(`locations/${id}`).json<{ id: string; deleted: boolean }>();
};
