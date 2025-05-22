import { UploadedFile } from "../types/UploadeFile";

class FileService {
  processFiles(files: File[]): UploadedFile[] {
    return files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size.toString(),
    }));
  }

  cleanupPreviews(files: UploadedFile[]): void {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }
}

export default new FileService();
