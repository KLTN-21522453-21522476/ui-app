import React, { useCallback, useState } from 'react';
import { Box, Container, Snackbar, Alert, Typography, Button } from '@mui/material';
import { useCamera } from '../../hooks/useCamera';
import { cameraApi } from '../../api/cameraApi';
//import { CapturedImage } from '../../types/camera.types';
//import { CAMERA_CONSTRAINTS } from '../../constants/camera.constants';

export const CameraPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  
  const {
    videoRef,
    isLoading,
    error: cameraError,
    permissionStatus,
    startCamera,
    captureImage
  } = useCamera();

  const handleInitCamera = useCallback(async () => {
    try {
      await startCamera();
      setCameraInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể khởi tạo camera');
    }
  }, [startCamera]);

  const handleCapture = useCallback(async () => {
    try {
      setIsUploading(true);
      setError(null);

      const capturedImage = await captureImage();
      if (!capturedImage) {
        setError('Không thể chụp ảnh');
        return;
      }

      const response = await cameraApi.uploadImage(capturedImage);
      
      if (response.success) {
        setUploadSuccess(true);
      } else {
        setError('Không thể tải lên ảnh');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn');
    } finally {
      setIsUploading(false);
    }
  }, [captureImage]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Camera
        </Typography>
        
        <Box sx={{ position: 'relative', mb: 2 }}>
          {!cameraInitialized && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleInitCamera}
                disabled={isLoading}
              >
                {isLoading ? 'Đang khởi tạo...' : 'Bật Camera'}
              </Button>
            </Box>
          )}
          
          {permissionStatus === 'denied' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2">
                Quyền truy cập camera đã bị từ chối. Vui lòng đặt lại quyền trong cài đặt trình duyệt của bạn,
                sau đó làm mới trang này và thử lại.
              </Typography>
            </Box>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ 
              display: cameraInitialized ? 'block' : 'none',
              width: '100%',
              borderRadius: '8px'
            }} 
          />
          
          {cameraInitialized && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCapture}
                disabled={isUploading}
              >
                Chụp ảnh
              </Button>
            </Box>
          )}
        </Box>

        <Snackbar
          open={isUploading}
          message="Đang tải lên ảnh..."
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        <Snackbar
          open={!!error || !!cameraError}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error || cameraError}
          </Alert>
        </Snackbar>

        <Snackbar
          open={uploadSuccess}
          autoHideDuration={3000}
          onClose={() => setUploadSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setUploadSuccess(false)}>
            Tải lên ảnh thành công!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
