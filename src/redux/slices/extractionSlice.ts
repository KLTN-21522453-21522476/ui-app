import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtractionData, Item } from '../../types/ExtractionData';

interface ExtractionState {
  extractedDataList: ExtractionData[];
  loading: { [fileName: string]: boolean };
  errors: { [fileName: string]: string | null };
}

const initialState: ExtractionState = {
  extractedDataList: [],
  loading: {},
  errors: {},
};

const extractionSlice = createSlice({
  name: 'extraction',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ fileName: string; isLoading: boolean }>) => {
      const { fileName, isLoading } = action.payload;
      state.loading[fileName] = isLoading;
      if (isLoading) {
        state.errors[fileName] = null;
      }
    },
    setError: (state, action: PayloadAction<{ fileName: string; error: string }>) => {
      const { fileName, error } = action.payload;
      state.errors[fileName] = error;
      state.loading[fileName] = false;
    },
    addExtractedData: (state, action: PayloadAction<ExtractionData>) => {
      const index = state.extractedDataList.findIndex(data => data.fileName === action.payload.fileName);
      if (index !== -1) {
        state.extractedDataList[index] = action.payload;
      } else {
        state.extractedDataList.push(action.payload);
      }
      state.loading[action.payload.fileName] = false;
      state.errors[action.payload.fileName] = null;
    },
    updateExtractedItem: (
      state,
      action: PayloadAction<{
        fileName: string;
        itemIndex: number;
        field: keyof Item;
        value: string;
      }>
    ) => {
      const { fileName, itemIndex, field, value } = action.payload;
      const dataIndex = state.extractedDataList.findIndex(data => data.fileName === fileName);
      if (dataIndex !== -1 && state.extractedDataList[dataIndex].items[itemIndex]) {
        if (field === 'price' || field === 'quantity') {
          state.extractedDataList[dataIndex].items[itemIndex][field] = Number(value);
        } else {
          state.extractedDataList[dataIndex].items[itemIndex][field] = value;
        }
      }
    },
    updateInvoiceData: (
      state,
      action: PayloadAction<{
        fileName: string;
        updatedData: Partial<ExtractionData>;
      }>
    ) => {
      const { fileName, updatedData } = action.payload;
      const dataIndex = state.extractedDataList.findIndex(data => data.fileName === fileName);
      if (dataIndex !== -1) {
        state.extractedDataList[dataIndex] = {
          ...state.extractedDataList[dataIndex],
          ...updatedData,
        };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addExtractedData,
  updateExtractedItem,
  updateInvoiceData,
} = extractionSlice.actions;

export default extractionSlice.reducer; 