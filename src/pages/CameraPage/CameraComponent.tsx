import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Snackbar, 
  Alert, 
  useTheme, 
  useMediaQuery,
  Fade
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  //FlipCameraIos as FlipCameraIcon,
  ScreenRotation as RotateIcon,
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon,
  FlashAuto as FlashAutoIcon,
  CameraFront as FrontCameraIcon,
  CameraRear as RearCameraIcon
} from '@mui/icons-material';
import { useCamera } from '../../hooks/useCamera';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
//import { useCamera as useCameraContext } from '../../contexts/CameraContext';
import { CameraSettings, FlashMode, CameraFacing, 
  //Orientation, 
  ExtendedMediaTrackConstraintSet } from './types';
import {
  CameraContainer,
  VideoContainer,
  VideoPreview,
  ControlsContainer,
  ControlButton,
  CaptureButton,
  DeviceSelectionContainer,
  ModelSelectionContainer,
  LoadingOverlay,
  StatusIndicator,
} from './CameraComponent.styles';

interface CameraComponentProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({ selectedModel, onModelChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Camera state
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [showModelSelection, setShowModelSelection] = useState(!isMobile);
  const [settings, setSettings] = useState<CameraSettings>({
    flashMode: 'off',
    facing: 'environment',
    orientation: 'portrait'
  });

  const {
    videoRef,
    isLoading,
    error: cameraError,
    permissionStatus,
    startCamera,
    captureImage,
    getDevices,
    stream
  } = useCamera();

  //const { capturedImages } = useCameraContext();

  // Get extraction status from Redux store
  const extractionStatus = useSelector((state: RootState) => state.extraction.loading);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);

  // Check if currently processing
  const isCurrentlyProcessing = useMemo(() => {
    return Object.values(extractionStatus).some(status => status);
  }, [extractionStatus]);

  // Check if extraction was successful
  const hasSuccessfulExtraction = useMemo(() => {
    return extractedDataList.length > 0 && !isCurrentlyProcessing;
  }, [extractedDataList, isCurrentlyProcessing]);

  // Monitor extraction status changes to update isProcessing
  useEffect(() => {
    if (isProcessing && !isCurrentlyProcessing) {
      setIsProcessing(false);
    }
  }, [isCurrentlyProcessing, isProcessing]);

  // Handle device orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.orientation === 90 || window.orientation === -90;
      setSettings(prev => ({
        ...prev,
        orientation: isLandscape ? 'landscape' : 'portrait'
      }));
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  // Auto-hide model selection on mobile after 3 seconds
  useEffect(() => {
    if (isMobile && showModelSelection) {
      const timer = setTimeout(() => {
        setShowModelSelection(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, showModelSelection]);

  const availableModels = useMemo(() => [
    { value: "yolo8", label: "YOLO 8", description: "Phiên bản cơ bản" },
    { value: "yolo8v6", label: "YOLO 8v6", description: "Phiên bản cải tiến" },
    { value: "yolo10", label: "YOLO 10", description: "Độ chính xác cao" },
    { value: "yolo11", label: "YOLO 11", description: "Phiên bản mới nhất" }
  ], []);

  const handleGetDevices = useCallback(async () => {
    try {
      const deviceList = await getDevices();
      setAvailableDevices(deviceList);
    } catch (err) {
      setError('Không thể lấy danh sách thiết bị camera');
    }
  }, [getDevices]);

  useEffect(() => {
    handleGetDevices();
  }, [handleGetDevices]);

  const handleInitCamera = useCallback(async (deviceId?: string) => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: { exact: settings.facing },
          width: { ideal: isMobile ? 1920 : 1280 },
          height: { ideal: isMobile ? 1080 : 720 }
        }
      };
      await startCamera();
      setCameraInitialized(true);

      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          await videoTrack.applyConstraints(constraints.video as MediaTrackConstraints);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể khởi tạo camera');
    }
  }, [startCamera, settings.facing, stream, isMobile]);

  const handleCapture = useCallback(async () => {
    try {
      if (isProcessing) return;
      
      // Add haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      
      setIsProcessing(true);
      setError(null);

      const result = await captureImage(selectedModel);
      if (!result) {
        setError('Không thể chụp ảnh');
        setIsProcessing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn');
      setIsProcessing(false);
    }
  }, [captureImage, selectedModel, isProcessing]);

  const toggleFlash = useCallback(() => {
    const modes: FlashMode[] = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(settings.flashMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setSettings(prev => ({ ...prev, flashMode: nextMode }));
    
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack?.getCapabilities?.()?.torch) {
        videoTrack.applyConstraints({
          advanced: [{ torch: nextMode === 'on' } as ExtendedMediaTrackConstraintSet]
        });
      }
    }
  }, [settings.flashMode, stream]);

  const toggleCamera = useCallback(async () => {
    const newFacing: CameraFacing = settings.facing === 'user' ? 'environment' : 'user';
    setSettings(prev => ({ ...prev, facing: newFacing }));
    
    if (cameraInitialized) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      await handleInitCamera();
    }
  }, [settings.facing, cameraInitialized, handleInitCamera, stream]);

  const toggleOrientation = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      orientation: prev.orientation === 'portrait' ? 'landscape' : 'portrait'
    }));
  }, []);

  const getFlashIcon = useCallback(() => {
    switch (settings.flashMode) {
      case 'on': return <FlashOnIcon />;
      case 'auto': return <FlashAutoIcon />;
      default: return <FlashOffIcon />;
    }
  }, [settings.flashMode]);

  return (
    <CameraContainer>
      {/* Model selection overlay */}
      <Fade in={showModelSelection}>
        <ModelSelectionContainer>
          <FormControl 
            fullWidth 
            size={isMobile ? "small" : "medium"}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            <InputLabel sx={{ color: 'white' }}>Chọn mô hình</InputLabel>
            <Select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              label="Chọn mô hình"
              onClose={() => isMobile && setShowModelSelection(false)}
            >
              {availableModels.map(model => (
                <MenuItem key={model.value} value={model.value}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {model.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {model.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ModelSelectionContainer>
      </Fade>

      {/* Device selection */}
      {availableDevices.length > 0 && !cameraInitialized && (
        <DeviceSelectionContainer elevation={3}>
          <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
            Chọn camera:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {availableDevices.map((device) => {
              const isObs = device.label.includes('OBS') || device.label.includes('Virtual Camera');
              return (
                <Button 
                  key={device.deviceId}
                  variant={isObs ? "contained" : "outlined"}
                  color={isObs ? "success" : "primary"}
                  onClick={() => handleInitCamera(device.deviceId)}
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                >
                  {device.label || `Camera ${availableDevices.indexOf(device) + 1}`}
                  {isObs && " (Khuyên dùng)"}
                </Button>
              );
            })}
          </Box>
        </DeviceSelectionContainer>
      )}

      {/* Main camera view */}
      <VideoContainer>
        {permissionStatus === 'denied' && (
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 2,
            maxWidth: '80%'
          }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              Quyền truy cập camera đã bị từ chối. Vui lòng đặt lại quyền trong cài đặt trình duyệt.
            </Typography>
          </Box>
        )}
        
        <VideoPreview
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={settings.orientation}
          style={{
            display: cameraInitialized ? 'block' : 'none'
          }}
        />

        {/* Loading overlay */}
        {(isLoading || isProcessing) && (
          <LoadingOverlay>
            <CircularProgress size={60} />
          </LoadingOverlay>
        )}

        {/* Status indicator */}
        {cameraInitialized && (
          <StatusIndicator>
            {settings.facing === 'user' ? 'Camera trước' : 'Camera sau'} • 
            {settings.flashMode === 'off' ? ' Flash tắt' : settings.flashMode === 'on' ? ' Flash bật' : ' Flash tự động'}
          </StatusIndicator>
        )}
      </VideoContainer>

      {/* Camera controls */}
      {cameraInitialized && (
        <ControlsContainer>
          <ControlButton
            onClick={toggleFlash}
            className={settings.flashMode !== 'off' ? 'active' : ''}
            aria-label="Toggle flash"
          >
            {getFlashIcon()}
          </ControlButton>

          <ControlButton
            onClick={toggleCamera}
            aria-label="Switch camera"
            className={settings.facing === 'user' ? 'active' : ''}
          >
            {settings.facing === 'user' ? <FrontCameraIcon /> : <RearCameraIcon />}
          </ControlButton>

          <CaptureButton
            onClick={handleCapture}
            disabled={isProcessing}
            aria-label="Capture photo"
          >
            {isProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <CameraIcon />
            )}
          </CaptureButton>

          <ControlButton
            onClick={toggleOrientation}
            className={settings.orientation === 'landscape' ? 'active' : ''}
            aria-label="Rotate camera"
          >
            <RotateIcon />
          </ControlButton>

          <ControlButton
            onClick={() => setShowModelSelection(!showModelSelection)}
            aria-label="Model selection"
          >
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
              AI
            </Typography>
          </ControlButton>
        </ControlsContainer>
      )}

      {/* Error messages */}
      <Snackbar
        open={!!error || !!cameraError}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error || cameraError}
        </Alert>
      </Snackbar>

      {/* Success message */}
      <Snackbar
        open={hasSuccessfulExtraction && !isProcessing}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">
          Xử lý ảnh thành công!
        </Alert>
      </Snackbar>
    </CameraContainer>
  );
};
