import { useState, useEffect } from 'react';
import { 
  UploadedFile, 
  FileWithStatus, 
  FileStatus, 
  ExtractResponse
} from '../types/FileList';
import { InvoiceData } from '../types/Invoice';
import {  Item } from '../types/ExtractionData';

export const useFileStatus = (files: UploadedFile[]) => {
  const [filesWithStatus, setFilesWithStatus] = useState<FileWithStatus[]>(
    files.map(file => ({ 
      ...file, 
      status: 'idle' as FileStatus,
      extractedData: undefined
    }))
  );

  useEffect(() => {
    setFilesWithStatus(prevFilesWithStatus => {
      const newFiles = files.filter(file => 
        !prevFilesWithStatus.some(prevFile => prevFile.name === file.name)
      );
      
      const updatedFiles = prevFilesWithStatus
        .filter(prevFile => files.some(file => file.name === prevFile.name))
        .map(prevFile => {
          const matchingFile = files.find(file => file.name === prevFile.name);
          return matchingFile ? { ...prevFile, ...matchingFile } : prevFile;
        });
      
      return [
        ...updatedFiles,
        ...newFiles.map(file => ({ 
          ...file, 
          status: 'idle' as FileStatus,
          extractedData: undefined
        }))
      ];
    });
  }, [files]);

  // Update file status
  const updateFileStatus = (
    fileName: string,
    status: FileStatus,
    extractedData?: ExtractResponse,
    errorMessage?: string
  ) => {
    setFilesWithStatus(prevFiles =>
      prevFiles.map(file =>
        file.name === fileName
          ? {
              ...file,
              status,
              errorMessage,
              // Set extractedData if status is 'success', otherwise undefined
              extractedData: status === 'success' ? extractedData : undefined
            }
          : file
      ) as FileWithStatus[]
    );
  };



  const updateExtractedData = (fileName: string, itemIndex: number, field: keyof Item, value: string | number) => {
    let processedValue = value;
    if ((field === 'price' || field === 'quantity') && typeof value === 'string') {
      processedValue = value === '' ? 0 : Number(value);
    }
    setFilesWithStatus(prevFiles =>
      prevFiles.map(file =>
        file.name === fileName && file.extractedData
          ? {
              ...file,
              extractedData: file.extractedData.map(data => {
                return {
                  ...data,
                  items: data.items.map((item, index) =>
                    index === itemIndex ? { ...item, [field]: processedValue } : item
                  ),
                };
              }),
            }
          : file
      ) as FileWithStatus[]
    );
  };
  

  // Update all invoice data values
  const updateInvoiceData = (fileName: string, updatedInvoiceData: Partial<InvoiceData>) => {
    setFilesWithStatus(prev => 
      prev.map(file => {
        if (file.name === fileName && file.extractedData) {
          // Find the invoice data for this file
          const invoiceDataIndex = file.extractedData.findIndex(item => item.fileName === fileName);
          
          if (invoiceDataIndex === -1) return file;
          
          // Clone the extractedData array
          const newExtractedData = [...file.extractedData];
          
          // Update the invoice data with all provided fields
          newExtractedData[invoiceDataIndex] = {
            ...newExtractedData[invoiceDataIndex],
            ...updatedInvoiceData
          };
          
          return {
            ...file,
            extractedData: newExtractedData
          };
        }
        return file;
      })
    );
  };

  const updateFileStatusWithExtractResponse = (fileName: string, status: FileStatus, extractedData?: ExtractResponse, errorMessage?: string) => {
    setFilesWithStatus(prevFiles => 
      prevFiles.map(file => 
        file.name === fileName 
          ? { ...file, status, extractedData, errorMessage } 
          : file
      ) as FileWithStatus[]
    );
  };

  return {
    filesWithStatus,
    updateFileStatus,
    updateFileStatusWithExtractResponse,
    updateExtractedData,
    updateInvoiceData
  };
};
