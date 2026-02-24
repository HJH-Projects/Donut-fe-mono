import type * as S from '../../orvalSchema';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postClothesApi = (
  ky: KyInstance,
  payload: S.CreateClothesDto,
  options?: ApiRequestOptions,
) => {
  return ky.post('clothes', { ...options, json: payload }).then((res) => res.json<S.ClothesResponseDto>());
};

export const getClothesApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('clothes', options).then((res) => res.json<S.ClothesResponseDto[]>());
};

export const getClothesDetailApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky.get(`clothes/${id}`, options).then((res) => res.json<S.ClothesResponseDto>());
};

export const patchClothesApi = (
  ky: KyInstance,
  id: string,
  payload: S.UpdateClothesDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .patch(`clothes/${id}`, {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.ClothesUpdateResponseDto>());
};

export const deleteClothesApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky.delete(`clothes/${id}`, options).then((res) => res.json<S.ClothesDeleteResponseDto>());
};

export const postClothesEnrichApi = (
  ky: KyInstance,
  payload: S.EnrichClothesDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('clothes/enrich', {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.EnrichClothesResponseDto>());
};

export const postClothesSuggestApi = (
  ky: KyInstance,
  payload: S.SuggestClothesDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('clothes/suggest', {
      ...options,
      json: payload,
    })
    .then((res) => res.json<unknown>());
};
