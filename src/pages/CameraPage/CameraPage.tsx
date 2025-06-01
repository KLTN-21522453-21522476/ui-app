import React, { useCallback, useState, useEffect } from 'react';
import { Box, Container, Snackbar, Alert, Typography, Button, CircularProgress, Paper } from '@mui/material';
import { useCamera } from '../../hooks/useCamera';
import { cameraApi } from '../../api/cameraApi';

export const CameraPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  
  const {
    videoRef,
    isLoading,
    error: cameraError,
    permissionStatus,
    startCamera,
    captureImage,
    getDevices,
  } = useCamera();

  const handleGetDevices = useCallback(async () => {
    const deviceList = await getDevices();
    setAvailableDevices(deviceList);
  }, [getDevices]);

  useEffect(() => {
    // Lấy danh sách thiết bị khi component được mount
    handleGetDevices();
  }, [handleGetDevices]);

  const handleInitCamera = useCallback(async (deviceId?: string) => {
    try {
      await startCamera(deviceId);
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
        
        {/* Hiển thị danh sách thiết bị camera có sẵn */}
        {availableDevices.length > 0 && !cameraInitialized && (
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chọn thiết bị camera:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableDevices.map((device) => {
                const isObs = device.label.includes('OBS') || device.label.includes('Virtual Camera');
                return (
                  <Button 
                    key={device.deviceId}
                    variant={isObs ? "contained" : "outlined"}
                    color={isObs ? "success" : "primary"}
                    onClick={() => handleInitCamera(device.deviceId)}
                    sx={{ mb: 1 }}
                  >
                    {device.label || `Camera ${availableDevices.indexOf(device) + 1}`}
                    {isObs && " (Khuyên dùng)"}
                  </Button>
                );
              })}
            </Box>
          </Paper>
        )}
        
        <Box sx={{ position: 'relative', mb: 2 }}>
          {!cameraInitialized && availableDevices.length === 0 && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleInitCamera()}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
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
                startIcon={isUploading ? <CircularProgress size={20} /> : null}
              >
                {isUploading ? 'Đang xử lý...' : 'Chụp ảnh'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Hiển thị nút chọn lại camera nếu đã khởi tạo */}
        {cameraInitialized && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => {
                setCameraInitialized(false);
                handleGetDevices();
              }}
            >
              Chọn camera khác
            </Button>
          </Box>
        )}

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
