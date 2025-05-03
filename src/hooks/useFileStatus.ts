import { useState, useEffect } from 'react';
import { 
  UploadedFile, 
  FileWithStatus, 
  FileStatus, 
} from '../types/FileList';
import { Item, InvoiceData } from '../types/Invoice';

export const useFileStatus = (files: UploadedFile[]) => {
  
  const [filesWithStatus, setFilesWithStatus] = useState<FileWithStatus[]>(
    files.map(file => ({ ...file, status: 'idle' as FileStatus }))
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
        ...newFiles.map(file => ({ ...file, status: 'idle' as FileStatus }))
      ];
    });
  }, [files]);

  // Update file status
  const updateFileStatus = (fileName: string, status: FileStatus, extractedData?: InvoiceData, errorMessage?: string) => {
    setFilesWithStatus(prev => 
      prev.map(file => {
        if (file.name === fileName) {
          const updatedFile: FileWithStatus = { 
            ...file, 
            status
          };
          
          if (errorMessage !== undefined) {
            updatedFile.errorMessage = errorMessage;
          }
          
          if (extractedData !== undefined) {
            // Create a new ExtractResponse array or update existing one
            const currentExtractedData = file.extractedData || [];
            const filteredData = currentExtractedData.filter(item => item.fileName !== fileName);
            updatedFile.extractedData = [...filteredData, extractedData];
          }
          
          return updatedFile;
        }
        return file;
      })
    );
  };

  // Update all files status
  const updateAllFilesStatus = (status: FileStatus, errorMessage?: string) => {
    setFilesWithStatus(prev => 
      prev.map(file => {
        const updatedFile: FileWithStatus = { ...file, status };
        if (errorMessage !== undefined) {
          updatedFile.errorMessage = errorMessage;
        }
        return updatedFile;
      })
    );
  };

  // Update extracted data field
  const updateExtractedData = (
    fileName: string, 
    itemIndex: number, 
    field: keyof Item, 
    value: string
  ) => {
    setFilesWithStatus(prev => 
      prev.map(file => {
        if (file.name === fileName && file.extractedData) {
          // Find the invoice data for this file
          const invoiceDataIndex = file.extractedData.findIndex(item => item.fileName === fileName);
          
          if (invoiceDataIndex === -1) return file;
          
          // Clone the extractedData array
          const newExtractedData = [...file.extractedData];
          
          // Clone the invoice data
          const invoiceData = { ...newExtractedData[invoiceDataIndex] };
                    
          // Clone the items array
          const items = invoiceData.items ? [...invoiceData.items] : [];
          
          // Update the specific item
          items[itemIndex] = {
            ...items[itemIndex],
            [field]: value
          };
          
          // Reassemble the updated structure
          invoiceData.items = items;
          newExtractedData[invoiceDataIndex] = invoiceData;
          
          return {
            ...file,
            extractedData: newExtractedData
          };
        }
        return file;
      })
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

  return {
    filesWithStatus,
    setFilesWithStatus,
    updateFileStatus,
    updateAllFilesStatus,
    updateExtractedData,
    updateInvoiceData,
  };
};
