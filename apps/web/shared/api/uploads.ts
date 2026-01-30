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

const mockPresign: PresignResponse = {
  uploadUrl: 'https://example.com/upload',
  filePath: 'uploads/mock/clothes/uuid.jpg',
  uploadToken: 'mock-upload-token',
};

const mockComplete: CompleteUploadResponse = {
  uploadId: 'mock-upload-id',
  filePath: 'uploads/mock/clothes/uuid.jpg',
  publicUrl:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
};

export const createPresignedUrl = async (payload: {
  type: 'clothes' | 'profile';
  contentType: string;
  contentLength: number;
}) => {
  try {
    return await clientKy.post('uploads/presign', { json: payload }).json<PresignResponse>();
  } catch {
    return mockPresign;
  }
};

export const completeUpload = async (payload: { filePath: string; uploadToken: string }) => {
  try {
    return await clientKy.post('uploads/complete', { json: payload }).json<CompleteUploadResponse>();
  } catch {
    return mockComplete;
  }
};
