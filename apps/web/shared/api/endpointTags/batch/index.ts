import type * as S from '../../orvalSchema';
import type { ApiRequestOptions, KyInstance } from '../_types';

export const postBatchGenerateApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.post('batch/generate', options).then((res) => res.json<S.BatchTriggerResponseDto>());
};

export const postBatchDevGenerateApi = (ky: KyInstance, options?: ApiRequestOptions) => {
  return ky.post('batch/dev/generate', options).then((res) => res.json<S.BatchTriggerResponseDto>());
};
