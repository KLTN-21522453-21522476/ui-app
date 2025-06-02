import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import FileList from "../components/layouts/upload/FileList";
import FileUploadComponent from "../components/layouts/upload/FileUploadComponent";
import { RootState } from "../redux/store";
import { Alert, Typography, Box } from '@mui/material';

const InvoiceExtraction: React.FC = () => {
  const files = useSelector((state: RootState) => state.fileUpload.files);
  const extractedDataList = useSelector((state: RootState) => state.extraction.extractedDataList);
  
  // Sử dụng useMemo để tránh tính toán lại mỗi khi render
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
          extractedData: [data],
          file: uploadedFile?.file
        };
      });
  }, [extractedDataList, files]);

  // Sử dụng useMemo để tránh tạo mảng mới mỗi khi render
  const allFiles = useMemo(() => {
    return [
      ...files.filter(f => !cameraFiles.some(cf => cf.name === f.name)),
      ...cameraFiles
    ];
  }, [files, cameraFiles]);

  // Tạo fileListComponent với useMemo để tránh render lại không cần thiết
  const fileListComponent = useMemo(() => {
    if (allFiles.length === 0) return null;
    return (
      <div id="file-list" className="mt-4">
        <FileList files={allFiles} />
      </div>
    );
  }, [allFiles]);

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
          title="Trích xuất dữ liệu"
          description="Sử dụng mô hình YOLO tiên tiến và OCR mạnh mẽ để trích xuất dữ liệu từ hoá đơn của bạn một cách nhanh chóng"
          fileListComponent={fileListComponent}
        />
      </div>
    </div>
  );
};

export default React.memo(InvoiceExtraction);
