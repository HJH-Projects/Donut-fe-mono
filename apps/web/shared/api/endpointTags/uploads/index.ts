import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postUploadsPresignApi = (
  ky: KyInstance,
  payload: S.CreatePresignedUrlDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('uploads/presign', {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.PresignUploadResponseDto>());
};

export const postUploadsCompleteApi = (
  ky: KyInstance,
  payload: S.CompleteUploadDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('uploads/complete', {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.CompleteUploadResponseDto>());
};

export const postUploadsTestUploadApi = (
  ky: KyInstance,
  payload: FormData,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('uploads/test-upload', {
      ...options,
      body: payload,
    })
    .then((res) => res.json<S.TestUploadResponseDto>());
};
