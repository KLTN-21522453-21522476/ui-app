import { FileWithStatus } from '../types/FileList';
import { ExtractionData, Item } from '../types/ExtractionData';
import { extractFile } from '../api/extractionApi';
import { ExtractResponse } from '../types/FileList';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setLoading,
  setError,
  addExtractedData,
  updateExtractedItem,
  updateInvoiceData as updateInvoiceDataAction
} from '../redux/slices/extractionSlice';

export const useFileExtraction = (
  filesWithStatus: FileWithStatus[],
  updateFileStatus: (fileName: string, status: 'idle' | 'loading' | 'success' | 'error', extractedData?: ExtractResponse, errorMessage?: string) => void,
  updateExtractedData: (fileName: string, itemIndex: number, field: keyof Item, value: string) => void,
  updateInvoiceData: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => void,
) => {
  const dispatch = useAppDispatch();
  const extractedDataList = useAppSelector(state => state.extraction.extractedDataList);

  // Extract data from a file
  const extractData = async (fileName: string, selectedModel: string): Promise<void> => {
    const fileToExtract = filesWithStatus.find(f => f.name === fileName);
    if (!fileToExtract) {
      console.error(`File ${fileName} not found`);
      return;
    }

    try {
      dispatch(setLoading({ fileName, isLoading: true }));
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
        updateAt: '',
        items: [],
        totalAmount: 0
      };

      // Handle the data from the response
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        if (data.address) formattedData.address = data.address;
        if (data.storeName) formattedData.storeName = data.storeName;
        if (data.id) formattedData.id = data.id;
        if (data.createdDate) formattedData.createdDate = data.createdDate;
        if (data.items) formattedData.items = data.items;
        if (data.totalAmount) formattedData.totalAmount = data.totalAmount;
        if (data.updateAt) formattedData.updateAt = data.updateAt;
      }

      dispatch(addExtractedData(formattedData));
      updateFileStatus(fileName, 'success', [formattedData]);
      console.log('[extractData] Formatted extraction data:', formattedData);
    } catch (error) {
      console.error('[extractData] Extraction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch(setError({ fileName, error: errorMessage }));
      updateFileStatus(fileName, 'error', undefined, errorMessage);
    }
  };

  return {
    extractedDataList,
    extractData,
    handleDataChange: (fileName: string, itemIndex: number, field: keyof Item, value: string) => {
      const file = filesWithStatus.find(f => f.name === fileName);
      if (!file) return;
      dispatch(updateExtractedItem({ fileName, itemIndex, field, value }));
      updateExtractedData(fileName, itemIndex, field, value);
    },
    handleInvoiceDataUpdate: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => {
      const file = filesWithStatus.find(f => f.name === fileName);
      if (!file) return;
      dispatch(updateInvoiceDataAction({ fileName, updatedData: updatedInvoiceData }));
      updateInvoiceData(fileName, updatedInvoiceData);
    }
  };
};
