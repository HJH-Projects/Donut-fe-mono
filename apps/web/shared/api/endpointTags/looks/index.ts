import type * as S from '../../orvalSchema';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postLooksApi = (
  ky: KyInstance,
  payload: S.CreateLookDto,
  options?: ApiRequestOptions,
) => {
  return ky.post('looks', { ...options, json: payload }).then((res) => res.json<S.LookResponseDto>());
};

export const getLooksApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('looks', options).then((res) => res.json<S.LookResponseDto[]>());
};

export const getLooksDetailApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky.get(`looks/${id}`, options).then((res) => res.json<S.LookResponseDto>());
};

export const patchLooksApi = (
  ky: KyInstance,
  id: string,
  payload: S.UpdateLookDto,
  options?: ApiRequestOptions,
) => {
  return ky.patch(`looks/${id}`, { ...options, json: payload }).then((res) => res.json<S.LookResponseDto>());
};

export const deleteLooksApi = (ky: KyInstance, id: string, options?: ApiRequestOptions) => {
  return ky.delete(`looks/${id}`, options).then((res) => res.json<S.LookDeleteResponseDto>());
};
