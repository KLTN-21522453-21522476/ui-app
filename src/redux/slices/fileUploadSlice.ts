import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilePreview {
  preview: string;
  name: string;
  size: string;
  type: string;
  lastModified?: number;
}

interface FileUploadState {
  files: FilePreview[];
}

const initialState: FileUploadState = {
  files: []
};

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<FilePreview[]>) => {
      state.files = [...state.files, ...action.payload];
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
    }
  }
});

export const { 
  addFiles, 
  removeFile, 
  clearFiles 
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
