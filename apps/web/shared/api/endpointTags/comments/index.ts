import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postShareCommentsApi = (
  ky: KyInstance,
  path: string,
  payload: S.CreateCommentDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post(`shares/${path}/comments`, {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.CommentResponseDto>());
};

export const getShareCommentsApi = (ky: KyInstance, path: string, options?: ApiRequestOptions) => {
  return ky
    .get(`shares/${path}/comments`, options)
    .then((res) => res.json<S.CommentResponseDto[]>());
};

export const deleteShareCommentApi = (
  ky: KyInstance,
  path: string,
  id: string,
  options?: ApiRequestOptions,
) => {
  return ky
    .delete(`shares/${path}/comments/${id}`, options)
    .then((res) => res.json<S.CommentDeleteResponseDto>());
};
