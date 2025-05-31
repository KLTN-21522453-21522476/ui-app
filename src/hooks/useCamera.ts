import { useState, useEffect, useCallback, useRef } from 'react';
import { CameraState, CapturedImage } from '../types/camera.types';
//import { CameraFacing } from '../enum/camera.enum';
import { ERROR_MESSAGES } from '../constants/camera.constants';

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    isLoading: false,
    error: null,
    stream: null,
    imageData: null,
    devices: [],
    selectedDevice: null,
    permissionStatus: 'prompt' as PermissionState, // 'granted' | 'denied' | 'prompt'
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const retryAttemptsRef = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;

  const checkPermissions = useCallback(async () => {
    try {
      // Check if the browser supports the Permissions API
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setState(prev => ({ ...prev, permissionStatus: result.state }));
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setState(prev => ({ ...prev, permissionStatus: result.state }));
        });

        return result.state;
      }
      return 'prompt';
    } catch (error) {
      console.warn('Permissions API not supported', error);
      return 'prompt';
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(ERROR_MESSAGES.NOT_SUPPORTED);
      }

      console.log('Đang yêu cầu quyền camera...');
      
      // Yêu cầu quyền camera với ràng buộc tối thiểu
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      // Dừng stream ngay vì chúng ta chỉ cần nó để xin quyền
      stream.getTracks().forEach(track => track.stop());

      // Cập nhật trạng thái quyền
      await checkPermissions();
      
      console.log('Quyền camera đã được cấp');
      return true;
    } catch (error) {
      console.error('Yêu cầu quyền thất bại:', error);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setState(prev => ({
          ...prev,
          error: ERROR_MESSAGES.PERMISSION_DENIED,
          permissionStatus: 'denied',
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: ERROR_MESSAGES.GENERIC_ERROR,
          isLoading: false
        }));
      }
      
      return false;
    }
  }, [checkPermissions]);


  const getDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error(ERROR_MESSAGES.NOT_SUPPORTED);
      }

      // Check current permission status
      const permissionState = await checkPermissions();
      
      // If permission is denied, don't proceed
      if (permissionState === 'denied') {
        throw new Error(ERROR_MESSAGES.PERMISSION_DENIED);
      }

      // If permission not granted, request it
      if (permissionState !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          throw new Error(ERROR_MESSAGES.PERMISSION_DENIED);
        }
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      console.log('Available video devices:', videoDevices.length);
      videoDevices.forEach(device => {
        console.log('Device:', device.label || 'unnamed device', device.deviceId);
      });

      setState(prev => ({ ...prev, devices: videoDevices }));
      return videoDevices;
    } catch (error) {
      console.error('Error in getDevices:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
        isLoading: false
      }));
      return [];
    }
  }, [checkPermissions, requestPermission]);

  const startCamera = useCallback(async (deviceId?: string) => {
    console.log('startCamera được gọi bởi người dùng');
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check permissions first
      const permissionState = await checkPermissions();
      
      // If permission is denied, request it
      if (permissionState !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          return;
        }
      }

      const constraintsToTry = [
        // 1. Try with specified or first available device
        {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: { ideal: 'environment' }
        },
        // 2. Try environment camera without device ID
        {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        // 3. Try user camera
        {
          facingMode: { ideal: 'user' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        // 4. Try with minimal constraints
        {
          facingMode: 'environment'
        },
        // 5. Last resort - any video device
        true
      ];

      let lastError = null;
      for (const constraints of constraintsToTry) {
        try {
          console.log('Trying camera with constraints:', JSON.stringify(constraints));
          const stream = await navigator.mediaDevices.getUserMedia({
            video: constraints,
            audio: false
          });

          if (!videoRef.current) {
            stream.getTracks().forEach(track => track.stop());
            throw new Error('Video element not ready');
          }

          videoRef.current.srcObject = stream;
          await new Promise<void>((resolve) => {
            if (!videoRef.current) return resolve();
            videoRef.current.onloadedmetadata = () => resolve();
          });

          streamRef.current = stream;
          setState(prev => ({
            ...prev,
            stream,
            isLoading: false,
            selectedDevice: deviceId || 'default',
            error: null
          }));

          console.log('Camera started successfully');
          return;
        } catch (error) {
          console.warn('Failed with constraints:', constraints, error);
          lastError = error;
        }
      }

      throw lastError || new Error(ERROR_MESSAGES.NOT_FOUND);
    } catch (error) {
      console.error('Error starting camera:', error);
      let errorMessage = ERROR_MESSAGES.GENERIC_ERROR;

      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = ERROR_MESSAGES.PERMISSION_DENIED;
            break;
          case 'NotFoundError':
            errorMessage = ERROR_MESSAGES.NOT_FOUND;
            break;
          case 'NotSupportedError':
            errorMessage = ERROR_MESSAGES.NOT_SUPPORTED;
            break;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));

      if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
        console.log(`Retrying camera initialization (attempt ${retryAttemptsRef.current + 1}/${MAX_RETRY_ATTEMPTS})`);
        retryAttemptsRef.current++;
        setTimeout(() => {
          startCamera(deviceId);
        }, 1000);
      }
    }
  }, [checkPermissions, requestPermission]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.label);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState(prev => ({ ...prev, stream: null }));
  }, []);

  const switchCamera = useCallback(async () => {
    console.log('Switching camera...');
    stopCamera();
    const devices = await getDevices();
    if (devices.length > 1) {
      const currentDeviceIndex = devices.findIndex(d => d.deviceId === state.selectedDevice);
      const nextDeviceIndex = (currentDeviceIndex + 1) % devices.length;
      console.log('Switching to device:', devices[nextDeviceIndex].label || 'unnamed device');
      await startCamera(devices[nextDeviceIndex].deviceId);
    } else {
      console.log('Only one camera available, restarting current camera');
      await startCamera(undefined);
    }
  }, [getDevices, startCamera, stopCamera, state.selectedDevice]);

  const captureImage = useCallback((): Promise<CapturedImage | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !state.stream) {
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        resolve(null);
        return;
      }

      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');

      const capturedImage: CapturedImage = {
        dataUrl,
        timestamp: Date.now(),
        deviceId: state.selectedDevice || 'unknown',
      };

      setState(prev => ({ ...prev, imageData: dataUrl }));
      resolve(capturedImage);
    });
  }, [state.stream, state.selectedDevice]);

  useEffect(() => {
    retryAttemptsRef.current = 0;
    console.log('Sẵn sàng khởi tạo camera khi người dùng yêu cầu...');
    
    // Chỉ kiểm tra quyền, không tự động khởi động camera
    checkPermissions();

    return () => {
      console.log('Đang dọn dẹp camera...');
      stopCamera();
    };
  }, [checkPermissions, stopCamera]);

  return {
    ...state,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    captureImage,
    getDevices,
    requestPermission,
  };
}; 