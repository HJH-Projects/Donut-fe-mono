import type * as S from '../../orvalSchema';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getRecommendationsLookApi = (
  ky: KyInstance,
  params?: {
    latitude?: number;
    longitude?: number;
    gender?: S.CreateLookRecommendationDtoGender;
  },
  options?: ApiRequestOptions,
) => {
  return ky
    .get('recommendations/look', {
      ...options,
      searchParams: params,
    })
    .then((res) => res.json<S.LookRecommendationResponseDto>());
};

export const postRecommendationsLookApi = (
  ky: KyInstance,
  payload: S.CreateLookRecommendationDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('recommendations/look', {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.LookRecommendationResponseDto>());
};

export const postRecommendationsTestGenerateImageApi = (
  ky: KyInstance,
  payload: FormData,
  options?: ApiRequestOptions,
) => {
  return ky
    .post('recommendations/test/generate-image', {
      ...options,
      body: payload,
    })
    .then((res) => res.json<S.TestImageGenerationResponseDto>());
};
