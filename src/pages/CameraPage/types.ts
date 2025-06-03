export type FlashMode = 'off' | 'on' | 'auto';
export type CameraFacing = 'user' | 'environment';
export type Orientation = 'portrait' | 'landscape';

export interface CameraSettings {
  flashMode: FlashMode;
  facing: CameraFacing;
  orientation: Orientation;
}

// Extended MediaTrackCapabilities to include torch
export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

// Extended MediaTrackConstraintSet to include torch
export interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

export interface CameraConstraints extends MediaTrackConstraints {
  facingMode?: CameraFacing | { exact: CameraFacing };
  advanced?: ExtendedMediaTrackConstraintSet[];
}

export interface CameraDevice extends MediaDeviceInfo {
  facingMode?: CameraFacing;
}

// Extend the MediaStreamTrack interface to include our custom capabilities
declare global {
  interface MediaStreamTrack {
    getCapabilities(): ExtendedMediaTrackCapabilities;
  }
} 