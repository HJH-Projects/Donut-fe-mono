import {
  createPresignedUrlAction,
  completeUploadAction,
} from '@/shared/api/actions/uploads.action';

export type UploadResult = {
  publicUrl: string;
};

export async function uploadToS3(
  file: File,
  type: 'clothes' | 'profile',
): Promise<UploadResult> {
  // 1. Get presigned URL
  const { uploadUrl, filePath, uploadToken } = await createPresignedUrlAction({
    type,
    contentType: file.type,
    contentLength: file.size,
  });

  // 2. Upload to S3
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`S3 upload failed: ${uploadResponse.status}`);
  }

  // 3. Complete upload
  const { publicUrl } = await completeUploadAction({
    filePath,
    uploadToken,
  });

  return { publicUrl };
}
