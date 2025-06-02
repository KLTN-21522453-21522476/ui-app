import React, { useCallback, useState } from 'react';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { CameraAlt, Cameraswitch, PhotoCamera } from '@mui/icons-material';
import { useCamera } from '../../hooks/useCamera';
import { CameraConfig } from '../../types/camera.types';
import CapturedImagesList from './CapturedImagesList';
//import { CAMERA_CONSTRAINTS } from '../../constants/camera.constants';
import '../../styles/components/camera.css';

interface CameraComponentProps {
  onCapture?: (imageData: string) => void;
  onError?: (error: string) => void;
  config?: Partial<CameraConfig>;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
  onCapture,
  onError,
  //config = CAMERA_CONSTRAINTS.MOBILE,
}) => {
  const [isCaptureMode, setIsCaptureMode] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [selectedModel] = useState('yolo8');
  const {
    videoRef,
    isLoading,
    error,
    imageData,
    switchCamera,
    captureImage,
    startCamera,
    permissionStatus
  } = useCamera();

  const handleCapture = useCallback(async () => {
    const captured = await captureImage(selectedModel);
    if (captured && onCapture) {
      onCapture(captured.dataUrl);
    }
    setIsCaptureMode(false);
  }, [captureImage, onCapture, selectedModel]);

  const handleRetake = useCallback(() => {
    setIsCaptureMode(true);
    startCamera();
  }, [startCamera]);

  const handleStartCamera = useCallback(async () => {
    setCameraInitialized(true);
    await startCamera();
  }, [startCamera]);

  // Handle errors
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (isLoading) {
    return (
      <Box className="camera-loading">
        <CircularProgress />
        <Typography>Đang khởi tạo camera...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="camera-error">
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => startCamera()}>
          Thử lại
        </Button>
      </Box>
    );
  }

  // Hiển thị nút bật camera nếu chưa khởi tạo
  if (!cameraInitialized) {
    return (
      <Box className="camera-start" sx={{ textAlign: 'center', p: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartCamera}
          startIcon={<CameraAlt />}
        >
          Bật Camera
        </Button>
      </Box>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <Box className="camera-error" sx={{ p: 3, bgcolor: 'warning.light', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quyền truy cập camera bị từ chối
        </Typography>
        <Typography variant="body2" paragraph>
          Bạn cần cấp quyền truy cập camera để sử dụng tính năng này. Vui lòng làm theo các bước sau:
        </Typography>
        <Typography component="div">
          <ul>
            <li>Chrome: Nhấp vào biểu tượng khóa/thông tin trong thanh địa chỉ → Cài đặt trang web</li>
            <li>Firefox: Nhấp vào biểu tượng khóa trong thanh địa chỉ → Kết nối bảo mật → Thông tin thêm → Quyền</li>
            <li>Safari: Tùy chọn → Trang web → Camera</li>
          </ul>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Làm mới trang
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="camera-container">
        {!isCaptureMode && imageData ? (
          <Box className="preview-container">
            <img src={imageData} alt="Captured" className="preview-image" />
            <Box className="preview-controls">
              <Button
                variant="contained"
                color="primary"
                onClick={handleRetake}
                startIcon={<CameraAlt />}
              >
                Chụp lại
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-preview"
            />
            <Box className="camera-controls">
              <IconButton
                onClick={switchCamera}
                className="camera-control-button"
              >
                <Cameraswitch />
              </IconButton>
              <IconButton
                onClick={handleCapture}
                className="camera-control-button capture"
              >
                <PhotoCamera />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
      <CapturedImagesList maxHeight={300} />
    </Box>
  );
};
