import { UploadedFile } from "../components/types/UploadeFile";

class FileService {
  // Process files before adding them to state
  processFiles(files: File[]): UploadedFile[] {
    return files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size.toString(),
    }));
  }

  // Clean up object URLs to prevent memory leaks
  cleanupPreviews(files: UploadedFile[]): void {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }

  // This would be where you'd add the API call to process the files
  //async extractDataFromInvoice(file: File): Promise<any> {
  async extractDataFromInvoice(): Promise<any> {

    // In a real application, this would be an API call
    // For example:
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('/api/extract-invoice', {
    //   method: 'POST',
    //   body: formData
    // });
    // return response.json();
    
    // Placeholder for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
            date: new Date().toISOString().split('T')[0],
            amount: '$' + (Math.random() * 1000).toFixed(2),
          }
        });
      }, 1500);
    });
  }
}

export default new FileService();
