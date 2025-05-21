import { ExtractionData, Item } from "./ExtractionData";

export type ExtractResponse = ExtractionData[];

export interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  size: string;
}

export type FileStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FileWithStatus extends UploadedFile {
  status: FileStatus;
  errorMessage?: string;
  extractedData?: ExtractResponse;
}

export interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (fileName: string) => void;
  onClearAll: () => void;
  user: Models.User<Models.Preferences> | null;
}

export interface FileItemProps {
  file: FileWithStatus;
  onExtract: (fileName: string) => Promise<void>;
  onRemove: (fileName: string) => void;
  onDataChange: (fileName: string, itemIndex: number, field: keyof Item, value: string) => void;
  onUpdateInvoiceData: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => void;
  extractedDataList: ExtractResponse | null;
}

export interface FilePreviewProps {
  width?: string | number;
  height?: string | number;
  file: FileWithStatus;
}

export interface ExtractedDataTableProps {
  file: FileWithStatus;
  extractResponse: ExtractResponse;
  onDataChange: (fileName: string, itemIndex: number, field: keyof Item, value: string) => void;
  onUpdateInvoiceData: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => void;
  onRemoveFile: (fileName: string) => void;
  onSubmitFile: (invoice: ExtractionData) => void
  onApproveFile: (invoice: ExtractionData) => void
}
