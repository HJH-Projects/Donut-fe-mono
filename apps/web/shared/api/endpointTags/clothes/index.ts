import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postClothesApi = (
  ky: KyInstance,
  payload: S.CreateClothesDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('clothes', { ...options, json: payload })
    .then((res) => res.json<S.ClothesResponseDto>());
};

export const getClothesApi = (
  ky: KyInstance,
  params?: S.ClothesControllerFindAllParams,
  options?: ApiRequestOptions,
) => {
  const searchParams = params?.category ? { category: params.category } : undefined;
  return ky
    .get('clothes', { ...options, searchParams })
    .then((res) => res.json<S.ClothesListItemResponseDto[]>());
};

export const postClothesImagePreviewApi = (ky: KyInstance, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return ky
    .post('clothes/images/preview', { body: formData, timeout: 120_000 })
    .then((res) => res.json<S.ClothesPreviewResponseDto>());
};

export const postClothesFavoriteApi = (ky: KyInstance, id: string) => {
  return ky.post(`clothes/${id}/favorite`).then((res) => res.json<S.ClothesFavoriteResponseDto>());
};

export const deleteClothesFavoriteApi = (ky: KyInstance, id: string) => {
  return ky
    .delete(`clothes/${id}/favorite`)
    .then((res) => res.json<S.ClothesFavoriteResponseDto>());
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
