'use server';

import { serverKy } from '../server';
import type { PresignResponse, CompleteUploadResponse } from '../uploads';

export async function createPresignedUrlAction(payload: {
  type: 'clothes' | 'profile';
  contentType: string;
  contentLength: number;
}) {
  return await serverKy.post('uploads/presign', { json: payload }).json<PresignResponse>();
}

export async function completeUploadAction(payload: {
  filePath: string;
  uploadToken: string;
}) {
  return await serverKy.post('uploads/complete', { json: payload }).json<CompleteUploadResponse>();
}
