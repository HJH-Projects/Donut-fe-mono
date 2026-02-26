import type * as S from '../../../model/orvalSchemas';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getAuthDevLoginApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('auth/dev/login', options).then((res) => res.json<S.AuthSuccessResponseDto>());
};

export const getAuthGoogleApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('auth/google', options).then(() => undefined);
};

export const getAuthGoogleCallbackApi = (
  ky: KyInstance,
  params: { code: string; state: string },
  options?: ApiRequestOptions,
) => {
  return ky
    .get('auth/google/callback', {
      ...options,
      searchParams: params,
    })
    .then((res) => res.text());
};

export const getAuthKakaoApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('auth/kakao', options).then(() => undefined);
};

export const getAuthKakaoCallbackApi = (
  ky: KyInstance,
  params: { code: string; state: string },
  options?: ApiRequestOptions,
) => {
  return ky
    .get('auth/kakao/callback', {
      ...options,
      searchParams: params,
    })
    .then((res) => res.text());
};

export const postAuthLogoutApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.post('auth/logout', options).then(() => undefined);
};

export const getAuthRefreshApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('auth/refresh', options).then(() => undefined);
};
