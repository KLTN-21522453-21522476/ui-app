import { InvoiceData } from "../types/Invoice";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_PROXY_ENDPOINT;

/**
 * Gửi file lên server để trích xuất dữ liệu
 * @param file File cần trích xuất
 * @returns Kết quả trích xuất từ server
 */
export const extractFile = async (
  files: File,
  model: string = "yolo8"
): Promise<{
  status: number;
  statusText: string;
  data?: InvoiceData[];
}> => {
  try {
    const formData = new FormData();
    formData.append("files", files);
    
    const response = await axios.post(
      `${BACKEND_URL}/image-process?model=${model}`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000,
      }
    );
    
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data as InvoiceData[],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        statusText: error.response?.statusText || error.message,
      };
    } else {
      return {
        status: 500,
        statusText: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
};

/**
 * Gửi nhiều file lên server để trích xuất dữ liệu
 * @param files Danh sách các file cần trích xuất
 * @returns Kết quả trích xuất từng file
 */
export const extractMultipleFiles = async (
  files: { fileName: string; file: File }[]
): Promise<{
  [fileName: string]: {
    status: number;
    statusText: string;
    data?: InvoiceData[];
  };
}> => {
  const results: {
    [fileName: string]: {
      status: number;
      statusText: string;
      data?: InvoiceData[];
    };
  } = {};

  for (const { fileName, file } of files) {
    results[fileName] = await extractFile(file);
  }

  return results;
};
