import { HTTPError } from 'ky';

/** 백엔드 에러 응답 형태 */
interface BackendErrorBody {
  statusCode: number;
  message: string;
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
