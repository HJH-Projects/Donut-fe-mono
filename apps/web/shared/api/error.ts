import { HTTPError } from 'ky';

/** 백엔드 에러 응답 형태 */
interface BackendErrorBody {
  statusCode: number;
  message: string;
}

/** 상태 코드별 기본 한국어 메시지 */
const STATUS_MESSAGES: Partial<Record<number, string>> = {
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '데이터를 찾을 수 없습니다.',
  409: '이미 존재하는 데이터입니다.',
  422: '입력값을 다시 확인해주세요.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다.',
  503: '서비스를 일시적으로 사용할 수 없습니다.',
};

/**
 * ApiError를 사용자에게 보여줄 메시지로 변환.
 * 400/409/422는 백엔드 메시지를 그대로 사용 (유효성 실패 이유가 명확),
 * 나머지는 상태 코드별 기본 메시지 또는 fallback 사용.
 */
export function getApiErrorMessage(error: ApiError, fallback?: string): string {
  const useServerMessage = new Set([400, 409, 422]);
  if (useServerMessage.has(error.statusCode) && error.serverMessage) {
    return error.serverMessage;
  }
  return STATUS_MESSAGES[error.statusCode] ?? fallback ?? '오류가 발생했습니다.';
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly serverMessage: string,
  ) {
    super(serverMessage || `API Error: ${statusCode}`);
    this.name = 'ApiError';
  }
}

/** ky HTTPError → ApiError 변환 */
export async function toApiError(error: unknown): Promise<ApiError> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.json<BackendErrorBody>();
      return new ApiError(body.statusCode, body.message);
    } catch {
      return new ApiError(error.response.status, error.message);
    }
  }
  if (error instanceof Error) {
    return new ApiError(0, error.message);
  }
  return new ApiError(0, 'Unknown error');
}
