export interface CameraConfig {
  facingMode: 'user' | 'environment';
  width: number;
  height: number;
}

export interface CameraState {
  isLoading: boolean;
  error: string | null;
  stream: MediaStream | null;
  imageData: string | null;
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  permissionStatus: PermissionState;
}

export interface CapturedImage {
  dataUrl: string;
  timestamp: number;
  deviceId: string;
}

export interface CameraPermissionState {
  granted: boolean;
  error: string | null;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
} 