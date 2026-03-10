import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getAnnouncementsApi = (
  ky: KyInstance,
  params?: S.AnnouncementsControllerListParams,
  options?: ApiRequestOptions,
) => {
  return ky
    .get('announcements', {
      ...options,
      searchParams: params,
    })
    .then((res) => res.json<S.AnnouncementListResponseDto>());
};

export const getAnnouncementByIdApi = (
  ky: KyInstance,
  id: string,
  options?: ApiRequestOptions,
) => {
  return ky.get(`announcements/${id}`, options).then((res) => res.json<S.AnnouncementDetailResponseDto>());
};
