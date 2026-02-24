import type * as S from '../../orvalSchema';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const getHealthApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('health', options).then((res) => res.json<S.HealthStatusDto>());
};

export const getHealthLlmApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.get('health/llm', options).then((res) => res.json<S.LlmHealthResponseDto>());
};
