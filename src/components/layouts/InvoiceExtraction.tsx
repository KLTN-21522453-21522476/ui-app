import React, { useState, useEffect } from "react";
import { UploadedFile } from "../types/UploadeFile";
import fileService from "../../hooks/fileService";
import FileList from "./FileList";
import FileUploadComponent from "./FileUploadComponent"; // Using our new combined component

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
    
    // You could also trigger processing here
    // files.forEach(file => {
    //   if (file.file) {
    //     processFile(file);
    //   }
    // });
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

  // Optional: Add a function to process files
  const processFile = async (file: UploadedFile) => {
    if (!file.file) return;
    
    // Update file status to processing
    setUploadedFiles(prevFiles => 
      prevFiles.map(f => 
        f.name === file.name ? { ...f, status: 'processing' } : f
      )
    );
    
    try {
      const result = await fileService.extractDataFromInvoice(file.file);
      
      // Update file with results
      setUploadedFiles(prevFiles => 
        prevFiles.map(f => 
          f.name === file.name ? { 
            ...f, 
            status: 'completed',
            result: result.data
          } : f
        )
      );
    } catch (error) {
      // Handle error
      setUploadedFiles(prevFiles => 
        prevFiles.map(f => 
          f.name === file.name ? { 
            ...f, 
            status: 'error',
            result: { error: 'Failed to process file' }
          } : f
        )
      );
    }
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
