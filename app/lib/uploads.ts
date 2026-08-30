import 'server-only';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
]);

export type FileValidationError =
  | 'too_large'
  | 'bad_type'
  | 'empty';

function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary environment variables are not configured.'
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export function validateUploadedFile(
  file: File
): FileValidationError | null {
  if (!file || file.size === 0) return 'empty';

  if (file.size > MAX_FILE_BYTES) {
    return 'too_large';
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return 'bad_type';
  }

  return null;
}

function uploadBuffer(
  buffer: Buffer,
  publicId: string
): Promise<UploadApiResponse> {
  const cloud = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloud.uploader.upload_stream(
      {
        public_id: publicId,

        // Cloudinary can handle PDFs as image assets.
        resource_type: 'image',

        // IMPORTANT: KYC documents must not be public.
        type: 'authenticated',

        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error ?? new Error('Cloudinary upload failed.')
          );
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function saveUserFile(
  userId: string,
  label: string,
  file: File
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const publicId =
    `2bucks/kyc/${userId}/${label}`;

  const result = await uploadBuffer(
    buffer,
    publicId
  );

  return result.public_id;
}