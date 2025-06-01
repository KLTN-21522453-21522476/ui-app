import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilePreview {
  preview: string;
  name: string;
  size: string;
  type: string;
  file?: File;
  lastModified?: number;
  status?: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  extractedData?: any;
  url?: string; // URL for remote images
}

interface FileUploadState {
  files: FilePreview[];
  selectedModel: string;
  isProcessing: boolean;
}

const initialState: FileUploadState = {
  files: [],
  selectedModel: 'yolo8',
  isProcessing: false
};

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<FilePreview[]>) => {
      const newFiles = action.payload.map(file => ({
        ...file,
        status: 'idle' as const
      }));
      state.files = [...state.files, ...newFiles];
    },
    removeFile: (state, action: PayloadAction<string>) => {
      const fileToRemove = state.files.find(file => file.name === action.payload);
      
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      state.files = state.files.filter(file => file.name !== action.payload);
    },
    clearFiles: (state) => {
      state.files.forEach(file => URL.revokeObjectURL(file.preview));
      state.files = [];
    },
    updateFileStatus: (state, action: PayloadAction<{ fileName: string; status: 'idle' | 'loading' | 'success' | 'error'; errorMessage?: string }>) => {
      const { fileName, status, errorMessage } = action.payload;
      const fileIndex = state.files.findIndex(file => file.name === fileName);
      if (fileIndex !== -1) {
        state.files[fileIndex].status = status;
        state.files[fileIndex].errorMessage = errorMessage;
      }
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    updateExtractedData: (state, action: PayloadAction<{ fileName: string; data: any }>) => {
      const { fileName, data } = action.payload;
      const fileIndex = state.files.findIndex(file => file.name === fileName);
      if (fileIndex !== -1) {
        state.files[fileIndex].extractedData = data;
      }
    }
  }
});

export const { 
  addFiles, 
  removeFile, 
  clearFiles,
  updateFileStatus,
  setSelectedModel,
  setIsProcessing,
  updateExtractedData
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
