import type * as S from '../../orvalSchema';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getUsersMeApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('users/me', options).then((res) => res.json<S.UserProfileResponseDto>());
};

export const patchUsersProfileApi = (
  ky: KyInstance,
  payload: S.UpdateProfileDto,
  options?: ApiRequestOptions,
) => {
  return ky
    .patch('users/profile', {
      ...options,
      json: payload,
    })
    .then((res) => res.json<S.UpdateProfileResponseDto>());
};

export const postUsersResetApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.post('users/reset', options).then(() => undefined);
};

export const postUsersResetNicknameApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky
    .post('users/nickname/reset', options)
    .then((res) => res.json<{ nickname: string }>());
};
