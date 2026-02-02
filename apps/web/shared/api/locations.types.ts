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

export type CreateLocationPayload = {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
  alias: string;
  isDefault: boolean;
};
