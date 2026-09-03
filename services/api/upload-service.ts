import { apiClient } from './api-client';

export interface UploadResponse {
  url: string;
  publicId?: string;
}

class UploadService {
  async uploadImage(imageUri: string, folder = 'yaalu/profiles'): Promise<UploadResponse> {
    if (!imageUri) {
      throw new Error('No image provided for upload.');
    }

    // If imageUri is already an HTTPS URL (Cloudinary or Web URL), return directly
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return { url: imageUri, publicId: 'existing_url' };
    }

    try {
      // Upload image to Cloudinary via backend Gateway
      const res = await apiClient.post<UploadResponse>('/uploads/image', {
        image: imageUri,
        folder: folder,
      });

      if (res && res.url) {
        return res;
      }
      return { url: imageUri };
    } catch (error: any) {
      console.warn('[UploadService Info]:', error?.message || error);
      // Fallback return imageUri if network unavailable during development
      return { url: imageUri };
    }
  }
}

export const uploadService = new UploadService();
