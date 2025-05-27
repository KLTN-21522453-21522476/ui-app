import { ExtractionData as ExtractedData, Item } from "./ExtractionData";
import { InvoiceData } from "./Invoice";

export type ExtractResponse = ExtractedData[];
export type ExtractionData = ExtractedData;

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
  groupId?: string;
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
  groupId?: string;
  onUpdateInvoiceData: (fileName: string, updatedInvoiceData: Partial<ExtractionData>) => void;
  onRemoveFile: (fileName: string) => void;
  onSubmitFile: (invoice: InvoiceData, file: File) => void
  onApproveFile: (invoiceId: string) => void
}
