export interface UploadedFile {
    file: File;
    preview: string;
    name: string;
    size: string;
}


export interface FileUploadComponentProps {
    title: string;
    description: string;
    onAddFiles: (files: UploadedFile[]) => void;
    fileListComponent?: React.ReactNode;
  }
  