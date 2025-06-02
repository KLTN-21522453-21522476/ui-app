import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import FileList from "../components/layouts/upload/FileList";
import FileUploadComponent from "../components/layouts/upload/FileUploadComponent";
import { RootState } from "../redux/store";
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UploadInvoicePage: React.FC = () => {
  const files = useSelector((state: RootState) => state.fileUpload.files);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);
  
  // Filter out camera-captured files
  const uploadedFiles = useMemo(() => {
    return files.filter(file => !file.name.startsWith('camera_'));
  }, [files]);

  const fileListComponent = useMemo(() => {
    if (uploadedFiles.length === 0) return null;
    return (
      <div id="file-list" className="mt-4">
        <FileList files={uploadedFiles} showExtractedData={false} />
      </div>
    );
  }, [uploadedFiles]);

  const hasExtractedData = extractedDataList.length > 0;

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4 px-3 px-sm-4">
      <div className="w-100" style={{ maxWidth: '1200px' }}>
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
