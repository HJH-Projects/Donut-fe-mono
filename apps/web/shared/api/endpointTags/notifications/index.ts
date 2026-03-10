import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getNotificationsApi = (
  ky: KyInstance,
  params?: S.NotificationsControllerListParams,
  options?: ApiRequestOptions,
) => {
  return ky
    .get('notifications', {
      ...options,
      searchParams: params,
    })
    .then((res) => res.json<S.NotificationListResponseDto>());
};

export const getNotificationsUnreadCountApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('notifications/unread-count', options).then((res) => res.json<S.UnreadCountResponseDto>());
};

export const patchNotificationsReadApi = (
  ky: KyInstance,
  id: string,
  options?: ApiRequestOptions,
) => {
  return ky.patch(`notifications/${id}/read`, options).then((res) => res.json<S.ReadNotificationResponseDto>());
};

export const patchNotificationsReadAllApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.patch('notifications/read-all', options).then((res) => res.json<S.ReadAllNotificationsResponseDto>());
};

