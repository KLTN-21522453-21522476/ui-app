import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExtractionData } from "../types/ExtractionData";
import { updateFileStatus, updateExtractedData } from '../redux/slices/fileUploadSlice';
import { RootState } from '../redux/store';

// URL constants for better management
const BACKEND_URL = import.meta.env.VITE_PROXY_ENDPOINT;
const IMAGE_PROCESS_ENDPOINT = `${BACKEND_URL}/image-process`;

/**
 * Response type for extraction APIs
 */
export interface ExtractionResponse {
  status: number;
  statusText: string;
  data?: ExtractionData[];
}

/**
 * Extract a single file using the specified model
 */
export const extractFile = async (
  file: File,
  model: string = "yolo8"
): Promise<ExtractionResponse> => {
  try {
    const formData = new FormData();
    formData.append("files", file);
    
    const response = await axios.post(
      `${IMAGE_PROCESS_ENDPOINT}?model=${model}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    const responseData = response.data as ExtractionData[];
    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    };
  } catch (error) {
    return {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * File info for multiple file extraction
 */
export interface FileInfo {
  fileName: string;
  file: File;
}

/**
 * Results for multiple file extraction
 */
export interface MultipleExtractionResults {
  [fileName: string]: ExtractionResponse;
}

/**
 * Extract multiple files using the specified model
 */
export const extractMultipleFiles = async (
  files: FileInfo[],
  model: string = "yolo8"
): Promise<MultipleExtractionResults> => {
  const results: MultipleExtractionResults = {};

  for (const { fileName, file } of files) {
    results[fileName] = await extractFile(file, model);
  }

  return results;
};

// Redux Async Thunks

/**
 * Async thunk for extracting a single file
 */
export const extractFileThunk = createAsyncThunk(
  'fileUpload/extractFile',
  async ({ fileName, file, model }: { fileName: string; file: File; model: string }, { dispatch }) => {
    try {
      dispatch(updateFileStatus({ fileName, status: 'loading' }));
      
      const response = await extractFile(file, model);
      
      if (response.status === 200 && response.data) {
        dispatch(updateFileStatus({ fileName, status: 'success' }));
        dispatch(updateExtractedData({ fileName, data: response.data }));
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      dispatch(updateFileStatus({ 
        fileName, 
        status: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error' 
      }));
      throw error;
    }
  }
);

/**
 * Async thunk for extracting multiple files
 */
export const extractMultipleFilesThunk = createAsyncThunk(
  'fileUpload/extractMultipleFiles',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { files, selectedModel } = state.fileUpload;
    const results: MultipleExtractionResults = {};

    for (const filePreview of files) {
      try {
        dispatch(updateFileStatus({ fileName: filePreview.name, status: 'loading' }));
        
        // Skip files that don't have the actual File object
        if (!filePreview.file) {
          dispatch(updateFileStatus({ 
            fileName: filePreview.name, 
            status: 'error', 
            errorMessage: 'No file data available' 
          }));
          continue;
        }

        const response = await extractFile(filePreview.file, selectedModel);
        
        if (response.status === 200 && response.data) {
          dispatch(updateFileStatus({ fileName: filePreview.name, status: 'success' }));
          dispatch(updateExtractedData({ fileName: filePreview.name, data: response.data }));
          results[filePreview.name] = response;
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        dispatch(updateFileStatus({ 
          fileName: filePreview.name, 
          status: 'error', 
          errorMessage: error instanceof Error ? error.message : 'Unknown error' 
        }));
        results[filePreview.name] = {
          status: 500,
          statusText: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return results;
  }
);