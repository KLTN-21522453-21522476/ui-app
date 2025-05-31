export const CAMERA_CONSTRAINTS = {
  DEFAULT: {
    width: 1280,
    height: 720,
    facingMode: 'environment' as 'environment',
  },
  MOBILE: {
    width: 720,
    height: 1280,
    facingMode: 'environment' as 'environment',
  },
};

export const IMAGE_QUALITY = 0.8;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const DEFAULT_FACING_MODE = 'environment';

export const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Camera permission was denied',
  NOT_SUPPORTED: 'Your browser does not support camera access',
  NOT_FOUND: 'No camera device was found',
  GENERIC_ERROR: 'An error occurred while accessing the camera'
}; 