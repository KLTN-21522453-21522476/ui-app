import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import FileList from "../components/layouts/upload/FileList";
import FileUploadComponent from "../components/layouts/upload/FileUploadComponent";
import { RootState } from "../redux/store";
import { Alert, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UploadInvoicePage: React.FC = () => {
  const files = useSelector((state: RootState) => state.fileUpload.files);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);
  
  const cameraFiles = useMemo(() => {
    return extractedDataList
      .filter(data => data.fileName.startsWith('camera_'))
      .map(data => {
        const uploadedFile = files.find(f => f.name === data.fileName);
        return {
          name: data.fileName,
          preview: uploadedFile?.preview || '',
          size: uploadedFile?.size || '0',
          type: 'image/jpeg',
          status: 'success' as const,
          file: uploadedFile?.file
        };
      });
  }, [extractedDataList, files]);

  const allFiles = useMemo(() => {
    return [
      ...files.filter(f => !cameraFiles.some(cf => cf.name === f.name)),
      ...cameraFiles
    ];
  }, [files, cameraFiles]);

  const fileListComponent = useMemo(() => {
    if (allFiles.length === 0) return null;
    return (
      <div id="file-list" className="mt-4">
        <FileList files={allFiles} showExtractedData={false} />
      </div>
    );
  }, [allFiles]);

  const hasExtractedData = extractedDataList.length > 0;

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4 px-3 px-sm-4">
      <div className="w-100" style={{ maxWidth: '1200px' }}>
        {cameraFiles.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Có {cameraFiles.length} hóa đơn đã được chụp từ camera
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Các hóa đơn được chụp từ camera sẽ được hiển thị cùng với các file được tải lên bên dưới
            </Typography>
          </Box>
        )}

        <FileUploadComponent
          title="Tải lên hóa đơn"
          description="Tải lên hóa đơn của bạn để trích xuất dữ liệu"
          fileListComponent={fileListComponent}
        />

        {hasExtractedData && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/extracted-data"
              variant="contained"
              color="primary"
              size="large"
            >
              Xem kết quả trích xuất
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
};

export default React.memo(UploadInvoicePage);
