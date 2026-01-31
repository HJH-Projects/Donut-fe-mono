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

export const getLocationsServer = async () => {
  try {
    return await serverKy.get('locations').json<LocationItem[]>();
  } catch {
    return [];
  }
};

export const getLocationsClient = async () => {
  try {
    return await clientKy.get('locations').json<LocationItem[]>();
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

export const getWeatherByLocationClient = async (id: string) => {
  try {
    return await clientKy.get(`locations/${id}/weather`).json<WeatherSnapshot>();
  } catch {
    return null;
  }
};
