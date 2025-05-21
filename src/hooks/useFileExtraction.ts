import { useState } from 'react';
import { FileWithStatus } from '../types/FileList';
import { ExtractionData, Item } from '../types/ExtractionData';
import { extractFile } from '../api/extractionApi';
import { ExtractResponse } from '../types/FileList';

export const useFileExtraction = (
  filesWithStatus: FileWithStatus[],
  updateFileStatus: (fileName: string, status: 'idle' | 'loading' | 'success' | 'error', extractedData?: ExtractResponse, errorMessage?: string) => void,
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
      updateFileStatus(fileName, 'loading');
      const response = await extractFile(fileToExtract.file, selectedModel);
      
      // Convert to ExtractionData format
      const formattedData: ExtractionData = {
        model: selectedModel,
        address: '',
        fileName: fileName,
        storeName: '',
        createdDate: new Date().toISOString(),
        id: '',
        status: 'pending',
        approvedBy: '',
        submittedBy: '',
        updateAt: new Date().toISOString(),
        items: [],
        totalAmount: 0
      };

      // Handle the data from the response
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.items) formattedData.items = data.items;
        if (data.totalAmount) formattedData.totalAmount = data.totalAmount;
      }

      updateFileStatus(fileName, 'success', [formattedData]);
      setExtractedDataList(prev => prev ? [...prev, formattedData] : [formattedData]);
    } catch (error) {
      console.error('Extraction error:', error);
      updateFileStatus(fileName, 'error', undefined, error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  
  return {
    extractedDataList: extractedDataList || [],
    extractData,
    handleDataChange: (fileName: string, itemIndex: number, field: keyof Item, value: string) => {
      const file = filesWithStatus.find(f => f.name === fileName);
      if (!file) return;
      updateExtractedData(fileName, itemIndex, field, value);
    },
    handleInvoiceDataUpdate: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => {
      const file = filesWithStatus.find(f => f.name === fileName);
      if (!file) return;
      updateInvoiceData(fileName, updatedInvoiceData);
    }
  };
};
