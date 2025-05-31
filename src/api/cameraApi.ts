import axios from 'axios';
import { CapturedImage, UploadResponse } from '../types/camera.types';
import { MAX_IMAGE_SIZE, SUPPORTED_IMAGE_TYPES } from '../constants/camera.constants';

const API_BASE_URL = import.meta.env.VITE_PROXY_ENDPOINT || 'http://localhost:3000/api';

export class CameraApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CameraApiError';
  }
}

export const cameraApi = {
  /**
   * Validates the image before upload
   */
  validateImage(image: CapturedImage): void {
    // Check if the image is too large
    const binary = atob(image.dataUrl.split(',')[1]);
    const imageSize = binary.length;
    if (imageSize > MAX_IMAGE_SIZE) {
      throw new CameraApiError('Image size exceeds maximum allowed size');
    }

    // Check if the image format is supported
    const format = image.dataUrl.split(';')[0].split(':')[1];
    if (!SUPPORTED_IMAGE_TYPES.includes(format)) {
      throw new CameraApiError('Unsupported image format');
    }
  },

  /**
   * Uploads a captured image to the server
   */
  async uploadImage(image: CapturedImage): Promise<UploadResponse> {
    try {
      this.validateImage(image);

      const formData = new FormData();
      // Convert base64 to blob
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();
      formData.append('image', blob);
      formData.append('timestamp', image.timestamp.toString());
      formData.append('deviceId', image.deviceId);

      const result = await axios.post<UploadResponse>(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return result.data;
    } catch (error) {
      if (error instanceof CameraApiError) {
        throw error;
      }
      throw new CameraApiError(
        (error as any)?.response?.data?.message || 'Failed to upload image'
      );
    }
  },

  /**
   * Retrieves the list of previously uploaded images
   */
  async getUploadedImages(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${API_BASE_URL}/images`);
      return response.data;
    } catch (error) {
      throw new CameraApiError(
        (error as any)?.response?.data?.message || 'Failed to fetch images'
      );
    }
  }
}; 