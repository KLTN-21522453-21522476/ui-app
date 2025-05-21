import React, { useState, useEffect } from "react";
import { UploadedFile } from "../../types/UploadeFile";
import fileService from "../../hooks/usefileService";
import FileList from "./file-list/FileList";
import FileUploadComponent from "./FileUploadComponent";

const InvoiceExtraction: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Clean up object URLs when component unmounts
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
    <FileUploadComponent
      title="Trích xuất dữ liệu"
      description="Sử dụng mô hình YOLO tiên tiến và OCR mạnh mẽ để trích xuất dữ liệu từ hoá đơn của bạn một cách nhanh chóng"
      onAddFiles={handleAddFiles}
      fileListComponent={
        uploadedFiles.length > 0 ? (
          <FileList
            files={uploadedFiles}
            onRemoveFile={handleRemoveFile}
            onClearAll={handleClearAll}
          />
        ) : null
      }
    />
  );
};

export default InvoiceExtraction;
