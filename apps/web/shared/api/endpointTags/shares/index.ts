import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getSharesApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('shares', options).then((res) => res.json<S.ShareLinkListItemResponseDto[]>());
};

export const getSharesDetailApi = (ky: KyInstance, path: string, options?: ApiRequestOptions) => {
  return ky.get(`shares/${path}`, options).then((res) => res.json<S.ShareLinkDetailResponseDto>());
};

export const postSharesApi = (
  ky: KyInstance,
  payload: S.CreateShareLinkDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('shares', { ...options, json: payload })
    .then((res) => res.json<S.ShareLinkResponseDto>());
};

export const patchSharesApi = (
  ky: KyInstance,
  id: string,
  payload: S.UpdateShareLinkDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .patch(`shares/${id}`, {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.ShareLinkUpdateResponseDto>());
};

export const deleteSharesApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky.delete(`shares/${id}`, options).then((res) => res.json<S.ShareLinkDeleteResponseDto>());
};
