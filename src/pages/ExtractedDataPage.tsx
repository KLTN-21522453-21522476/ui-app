import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Box, Typography, Paper, Container, Button } from '@mui/material';
import ExtractedDataTable from '../components/layouts/upload/ExtractedDataTable';
import { Link } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import { useCamera } from '../contexts/CameraContext';

const ExtractedDataPage: React.FC = () => {
  const files = useSelector((state: RootState) => state.fileUpload.files);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);
  const selectedGroupId = useSelector((state: RootState) => state.groups.selectedGroupId);
  const { createInvoice, approveInvoice } = useInvoices(selectedGroupId || '');
  const { capturedImages } = useCamera();

  const filesWithExtractedData = useMemo(() => {
    // Handle uploaded files
    const uploadedFiles = files.map(file => {
      const extractedData = extractedDataList.find(data => data.fileName === file.name);
      return {
        ...file,
        status: extractedData ? 'success' as const : 'idle' as const,
        extractedData: extractedData ? [extractedData] : undefined,
        file: file.file || new File([], file.name)
      };
    }).filter(file => file.extractedData);

    // Handle camera-captured images
    const capturedFiles = capturedImages.map(captured => {
      const extractedData = extractedDataList.find(data => data.fileName === captured.id);
      return {
        name: captured.id,
        preview: captured.dataUrl,
        size: (captured.file.size / 1024).toFixed(2),
        type: 'image/jpeg',
        status: extractedData ? 'success' as const : 'idle' as const,
        extractedData: extractedData ? [extractedData] : undefined,
        file: captured.file
      };
    }).filter(file => file.extractedData);

    return [...uploadedFiles, ...capturedFiles];
  }, [files, extractedDataList, capturedImages]);

  if (filesWithExtractedData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Chưa có dữ liệu trích xuất
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vui lòng tải lên và trích xuất hóa đơn trước khi xem kết quả
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/upload-invoice"
              variant="contained"
              color="primary"
              size="large"
            >
              Tải lên hóa đơn
            </Button>
            <Button
              component={Link}
              to="/invoice-capture"
              variant="outlined"
              color="primary"
              size="large"
            >
              Chụp hóa đơn
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kết quả trích xuất dữ liệu
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dưới đây là kết quả trích xuất từ {filesWithExtractedData.length} hóa đơn
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/upload-invoice"
            variant="outlined"
            color="primary"
          >
            Tải lên hóa đơn
          </Button>
          <Button
            component={Link}
            to="/invoice-capture"
            variant="outlined"
            color="primary"
          >
            Chụp hóa đơn
          </Button>
        </Box>
      </Box>

      {filesWithExtractedData.map((file) => (
        <Paper key={file.name} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {file.name}
          </Typography>
          {file.extractedData && (
            <ExtractedDataTable
              file={file}
              extractResponse={file.extractedData}
              groupId={selectedGroupId || undefined}
              onRemoveFile={() => {}} // We don't want to remove files from this view
              onSubmitFile={createInvoice}
              onApproveFile={approveInvoice}
            />
          )}
        </Paper>
      ))}
    </Container>
  );
};

export default ExtractedDataPage; 