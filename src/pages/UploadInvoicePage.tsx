import React, { useState, useEffect } from "react";
import { UploadedFile } from "../types/UploadeFile";
import fileService from "../hooks/useFileService";
import FileList from "../components/layouts/upload/FileList";
import FileUploadComponent from "../components/layouts/upload/FileUploadComponent"; 
import { useSelector } from 'react-redux';

const InvoiceExtraction: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const selectedGroupId = useSelector((state: any) => state.groups.selectedGroupId);

  useEffect(() => {
    return () => {
      fileService.cleanupPreviews(uploadedFiles);
    };
  }, [uploadedFiles]);

  const handleAddFiles = (files: UploadedFile[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (fileName: string) => {
    const fileToRemove = uploadedFiles.find(file => file.name === fileName);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleClearAll = () => {
    fileService.cleanupPreviews(uploadedFiles);
    setUploadedFiles([]);
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center py-4 px-3 px-sm-4">
      <div className="w-100" style={{ maxWidth: '1200px' }}>
        <FileUploadComponent
          title="Trích xuất dữ liệu"
          description="Sử dụng mô hình YOLO tiên tiến và OCR mạnh mẽ để trích xuất dữ liệu từ hoá đơn của bạn một cách nhanh chóng"
          onAddFiles={handleAddFiles}
          fileListComponent={
            uploadedFiles.length > 0 ? (
              <div className="mt-4">
                <FileList
                  files={uploadedFiles}
                  onRemoveFile={handleRemoveFile}
                  onClearAll={handleClearAll}
                  groupId={selectedGroupId}
                />
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default InvoiceExtraction;