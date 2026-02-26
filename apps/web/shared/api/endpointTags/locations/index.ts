import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postLocationsApi = (
  ky: KyInstance,
  payload: S.CreateLocationDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('locations', { ...options, json: payload })
    .then((res) => res.json<S.UserLocationResponseDto>());
};

export const getLocationsApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky
    .get('locations', options)
    .then((res) => res.json<S.UserLocationResponseDto[] | S.LocationDto>());
};

export const patchLocationsApi = (
  ky: KyInstance,
  id: string,
  payload: S.UpdateLocationDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .patch(`locations/${id}`, { ...options, json: payload })
    .then((res) => res.json<S.UserLocationResponseDto>());
};

export const deleteLocationsApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky
    .delete(`locations/${id}`, options)
    .then((res) => res.json<S.UserLocationDeleteResponseDto>());
};

export const getLocationWeatherApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky.get(`locations/${id}/weather`, options).then((res) => res.json<S.WeatherResponseDto>());
};
