import { useState } from 'react';
import { FileWithStatus } from '../types/FileList';
import { ExtractionData, Item } from '../types/ExtractionData';
import { extractFile } from '../api/extractionApi';

export const useFileExtraction = (
  filesWithStatus: FileWithStatus[],
  updateFileStatus: (fileName: string, status: 'idle' | 'loading' | 'success' | 'error', extractedData?: ExtractionData, errorMessage?: string) => void,
  updateExtractedData: (fileName: string, itemIndex: number, field: keyof Item, value: string) => void,
  updateInvoiceData: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => void,
) => {
  const [extractedDataList, setExtractedDataList] = useState<ExtractionData[] | null>(null);

  // Extract data from a file
  const extractData = async (fileName: string, selectedModel: string): Promise<void> => {
    const fileToExtract = filesWithStatus.find(f => f.name === fileName);
    if (!fileToExtract) {
      console.error(`File ${fileName} not found`);
      return;
    }

    try {
      // Set status to loading
      updateFileStatus(fileName, 'loading');

      // Call the extraction API
      const response = await extractFile(fileToExtract.file, selectedModel);
      
      if (response.status !== 200 || !response.data) {
        throw new Error(response.statusText || 'Failed to extract data');
      }

      // Get the first result from the data array
      const extractedData = response.data[0] || {
        fileName: fileName,
        storeName: '',
        createdDate: new Date().toISOString().split('T')[0],
        id: '',
        status: 'pending',
        approvedBy: '',
        submittedBy: 'current_user',
        items: []
      };

      // Make sure the fileName matches
      const invoiceData: ExtractionData = {
        ...extractedData,
        fileName: fileName // Ensure fileName is set correctly
      };

      // Update file status with extracted data
      updateFileStatus(fileName, 'success', invoiceData);

      // Update extracted data list
      setExtractedDataList(prev => {
        const newList = prev ? [...prev] : [];
        const existingIndex = newList.findIndex(item => item.fileName === fileName);
        
        if (existingIndex >= 0) {
          newList[existingIndex] = invoiceData;
        } else {
          newList.push(invoiceData);
        }
        
        return newList;
      });
    } catch (error) {
      console.error('Error extracting data:', error);
      updateFileStatus(fileName, 'error', undefined, error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  // Handle item data change
  const handleDataChange = (fileName: string, itemIndex: number, field: keyof Item, value: string) => {
    updateExtractedData(fileName, itemIndex, field, value);
    
    // Update the extracted data list state
    setExtractedDataList(prev => {
      if (!prev) return null;
      
      return prev.map(invoiceData => {
        if (invoiceData.fileName === fileName) {
          const updatedItems = invoiceData.items ? [...invoiceData.items] : [];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [field]: value
          };
          
          const updatedTotalAmount = calculateTotalAmount(updatedItems);

          return {
            ...invoiceData,
            items: updatedItems,
            totalAmount: updatedTotalAmount
          };
        }
        return invoiceData;
      });
    });
  };

  // Handle invoice data updates
  const handleInvoiceDataUpdate = (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => {
    updateInvoiceData(fileName, updatedInvoiceData);
    
    // Update the extracted data list state
    setExtractedDataList(prev => {
      if (!prev) return null;
      
      return prev.map(invoiceData => {
        if (invoiceData.fileName === fileName) {
          return {
            ...invoiceData,
            ...updatedInvoiceData
          };
        }
        return invoiceData;
      });
    });
  };

  const calculateTotalAmount = (items: Item[]) => {
    if (!items) return 0;
    
    let total = 0;
    
    for (let i = 0; i < items.length; i++) {
      const price = items[i].price || 0;
      const quantity = items[i].quantity || 0;
      total += price * quantity;
    }
    
    return total;
  };
  
  return {
    extractedDataList,
    extractData,
    handleDataChange,
    handleInvoiceDataUpdate,
  };
};
