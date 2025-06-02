import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Box, Container, Snackbar, Alert, Typography, Button, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useCamera } from '../../hooks/useCamera';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useCamera as useCameraContext } from '../../contexts/CameraContext';

export const CameraPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState('yolo8');
  
  const {
    videoRef,
    isLoading,
    error: cameraError,
    permissionStatus,
    startCamera,
    captureImage,
    getDevices,
  } = useCamera();

  const { capturedImages } = useCameraContext();

  // Get extraction status from Redux store
  const extractionStatus = useSelector((state: RootState) => state.extraction.loading);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);

  // Kiểm tra xem có đang xử lý hay không
  const isCurrentlyProcessing = useMemo(() => {
    return Object.values(extractionStatus).some(status => status);
  }, [extractionStatus]);

  // Kiểm tra xem có trích xuất thành công hay không
  const hasSuccessfulExtraction = useMemo(() => {
    return extractedDataList.length > 0 && !isCurrentlyProcessing;
  }, [extractedDataList, isCurrentlyProcessing]);

  // Theo dõi sự thay đổi của trạng thái trích xuất để cập nhật isProcessing
  useEffect(() => {
    if (isProcessing && !isCurrentlyProcessing) {
      setIsProcessing(false);
    }
  }, [isCurrentlyProcessing, isProcessing]);

  const availableModels = useMemo(() => [
    { value: "yolo8", label: "YOLO 8", description: "Phiên bản cơ bản, phù hợp với hầu hết các hóa đơn" },
    { value: "yolo8v6", label: "YOLO 8v6", description: "Phiên bản cải tiến của YOLO 8" },
    { value: "yolo10", label: "YOLO 10", description: "Phiên bản mới, độ chính xác cao hơn" },
    { value: "yolo11", label: "YOLO 11", description: "Phiên bản mới nhất, tối ưu nhất" }
  ], []);

  const handleGetDevices = useCallback(async () => {
    const deviceList = await getDevices();
    setAvailableDevices(deviceList);
  }, [getDevices]);

  useEffect(() => {
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
      if (isProcessing) return;
      
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

  // Tạo các component UI với useMemo để tránh render lại không cần thiết
  const deviceSelectionUI = useMemo(() => {
    if (availableDevices.length === 0 || cameraInitialized) return null;
    
    return (
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
    );
  }, [availableDevices, cameraInitialized, handleInitCamera]);

  const cameraInitUI = useMemo(() => {
    if (cameraInitialized || availableDevices.length > 0) return null;
    
    return (
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
    );
  }, [cameraInitialized, availableDevices.length, handleInitCamera, isLoading]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Camera
        </Typography>
        
        {/* Model selection */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Chọn mô hình xử lý</InputLabel>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            label="Chọn mô hình xử lý"
          >
            {availableModels.map(model => (
              <MenuItem key={model.value} value={model.value}>
                {model.label} - {model.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Camera device selection */}
        {deviceSelectionUI}
        
        <Box sx={{ position: 'relative', mb: 2 }}>
          {cameraInitUI}
          
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
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} /> : null}
              >
                {isProcessing ? 'Đang xử lý...' : 'Chụp và xử lý'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Camera reselection button */}
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

        {/* Processing status */}
        <Snackbar
          open={isProcessing}
          message="Đang xử lý ảnh..."
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        {/* Error messages */}
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

        {/* Success message */}
        <Snackbar
          open={hasSuccessfulExtraction && !isProcessing}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success">
            Xử lý ảnh thành công! Bạn có thể tiếp tục chụp ảnh hoặc kiểm tra kết quả trong trang kết quả trích xuất
          </Alert>
        </Snackbar>

        {/* Captured images count */}
        {capturedImages.length > 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Đã chụp {capturedImages.length} ảnh
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default React.memo(CameraPage);
