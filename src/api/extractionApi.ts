import axios from 'axios';
import { ExtractionData } from "../types/ExtractionData";

// URL constants for better management
const BACKEND_URL = import.meta.env.VITE_PROXY_ENDPOINT;
const IMAGE_PROCESS_ENDPOINT = `${BACKEND_URL}/image-process`;

/**
 * Response type cho các API extraction
 */
export interface ExtractionResponse {
  status: number;
  statusText: string;
  data?: ExtractionData[];
}

/**
 * Gửi file lên server để trích xuất dữ liệu
 * @param file File cần trích xuất
 * @param model Model sử dụng để trích xuất dữ liệu
 * @returns Kết quả trích xuất từ server
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
 * File info đầu vào cho việc trích xuất nhiều file
 */
export interface FileInfo {
  fileName: string;
  file: File;
}

/**
 * Kết quả trích xuất nhiều file
 */
export interface MultipleExtractionResults {
  [fileName: string]: ExtractionResponse;
}

/**
 * Gửi nhiều file lên server để trích xuất dữ liệu
 * @param files Danh sách các file cần trích xuất
 * @param model Model sử dụng để trích xuất dữ liệu
 * @returns Kết quả trích xuất từng file
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