import { clientKy } from './client';
import { serverKy } from './server';

export type LocationItem = {
  id: string;
  alias: string;
  isDefault: boolean;
  location: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    timezone?: string;
  };
};

export type WeatherSnapshot = {
  tempCurrent: number;
  tempMin: number;
  tempMax: number;
  windSpeed: number;
  precipitationProbability: number;
  skyCode?: number;
  precipitationTypeCode?: number;
};

const defaultLocation: LocationItem = {
  id: 'loc-seoul-cityhall',
  alias: '서울시청',
  isDefault: true,
  location: {
    id: 'loc-seoul-cityhall',
    name: '서울시청',
    lat: 37.5665,
    lon: 126.978,
    timezone: 'Asia/Seoul',
  },
};

const mockLocations: LocationItem[] = [
  {
    id: 'loc-1',
    alias: '우리집',
    isDefault: true,
    location: {
      id: 'loc-seoul',
      name: '서울',
      lat: 37.5665,
      lon: 126.978,
      timezone: 'Asia/Seoul',
    },
  },
];

const mockWeather: WeatherSnapshot = {
  tempCurrent: 5,
  tempMin: -2,
  tempMax: 7,
  windSpeed: 2.1,
  precipitationProbability: 20,
  skyCode: 1,
  precipitationTypeCode: 0,
};

const normalizeLocations = (value: unknown) => {
  if (!Array.isArray(value) || value.length === 0) {
    return [defaultLocation];
  }
  return value as LocationItem[];
};

export const getLocationsServer = async () => {
  try {
    const res = await serverKy.get('locations').json<LocationItem[]>();
    return normalizeLocations(res);
  } catch {
    return mockLocations;
  }
};

export const getLocationsClient = async () => {
  try {
    const res = await clientKy.get('locations').json<LocationItem[]>();
    return normalizeLocations(res);
  } catch {
    return mockLocations;
  }
};

export const getWeatherByLocationServer = async (id: string) => {
  try {
    return await serverKy.get(`locations/${id}/weather`).json<WeatherSnapshot>();
  } catch {
    return mockWeather;
  }
};

export const getWeatherByLocationClient = async (id: string) => {
  try {
    return await clientKy.get(`locations/${id}/weather`).json<WeatherSnapshot>();
  } catch {
    return mockWeather;
  }
};
