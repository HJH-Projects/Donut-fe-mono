import { postUploadsPresignApi, postUploadsCompleteApi } from '@/shared/api/endpointTags/uploads';
import { CreatePresignedUrlDtoContentType } from '@/shared/model/orvalSchemas';
import { clientKy } from '@/features/api/clientKy';

export type UploadResult = {
  publicUrl: string;
};

export async function uploadToS3(file: File, type: 'clothes' | 'profile'): Promise<UploadResult> {
  const allowedContentTypes = new Set<string>(Object.values(CreatePresignedUrlDtoContentType));
  const contentType = (
    allowedContentTypes.has(file.type) ? file.type : 'image/jpeg'
  ) as CreatePresignedUrlDtoContentType;

  // 1. Get presigned URL
  const { uploadUrl, filePath, uploadToken } = await postUploadsPresignApi(clientKy, {
    type,
    contentType,
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
  const { publicUrl } = await postUploadsCompleteApi(clientKy, {
    filePath,
    uploadToken,
  });

  return { publicUrl };
}
