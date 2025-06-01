export interface UploadedFile {
    preview: string;
    name: string;
    size: string;
    type: string;
    lastModified?: number;
    status?: 'idle' | 'loading' | 'success' | 'error';
    errorMessage?: string;
    extractedData?: any;
}


export interface FileUploadComponentProps {
    title: string;
    description: string;
    fileListComponent?: React.ReactNode;
}
  