import { clientKy } from './client';

export type PresignResponse = {
  uploadUrl: string;
  filePath: string;
  uploadToken: string;
};

export type CompleteUploadResponse = {
  uploadId: string;
  filePath: string;
  publicUrl: string;
};

export const createPresignedUrl = async (payload: {
  type: 'clothes' | 'profile';
  contentType: string;
  contentLength: number;
}) => {
  return await clientKy.post('uploads/presign', { json: payload }).json<PresignResponse>();
};

export const completeUpload = async (payload: { filePath: string; uploadToken: string }) => {
  return await clientKy.post('uploads/complete', { json: payload }).json<CompleteUploadResponse>();
};
