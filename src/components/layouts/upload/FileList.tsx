// src/components/FileList.tsx

import React, { useState } from 'react';
import { Card, ListGroup, Button, Alert, Toast, Form} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { 
  removeFile, 
  clearFiles, 
  setSelectedModel,
  FilePreview,
  updateFileStatus,
  updateExtractedData
} from '../../../redux/slices/fileUploadSlice';
import { FileWithStatus } from '../../../types/FileList';
import ExtractedDataTable from './ExtractedDataTable';
import { RootState } from '../../../redux/store';
import { useInvoices } from '../../../hooks/useInvoices';
import { AppDispatch } from '../../../redux/store';
import { useFileExtraction } from '../../../hooks/useFileExtraction';

interface FileListProps {
  files: FilePreview[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedModel = useSelector((state: RootState) => state.fileUpload.selectedModel);
  const selectedGroupId = useSelector((state: RootState) => state.groups.selectedGroupId);
  const { createInvoice, approveInvoice } = useInvoices(selectedGroupId || '');
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'danger'}>({
    show: false,
    message: '',
    type: 'success'
  });

  const { extractData } = useFileExtraction(
    files.map(f => ({ 
      ...f, 
      status: f.status || 'idle',
      file: f.file || new File([], f.name) // Ensure file is always defined
    })),
    (fileName, status, extractedData, errorMessage) => {
      // Update file status in UI
      dispatch(updateFileStatus({ fileName, status, errorMessage }));
      if (status === 'success' && extractedData) {
        dispatch(updateExtractedData({ fileName, data: extractedData }));
      }
    },
    () => {}, // We don't need these callbacks as they're handled in the slice
    () => {}
  );

  const availableModels = [
    { value: "yolo8", label: "YOLO 8", description: "Phiên bản cơ bản, phù hợp với hầu hết các hóa đơn" },
    { value: "yolo8v6", label: "YOLO 8v6", description: "Phiên bản cải tiến của YOLO 8" },
    { value: "yolo10", label: "YOLO 10", description: "Phiên bản mới, độ chính xác cao hơn" },
    { value: "yolo11", label: "YOLO 11", description: "Phiên bản mới nhất, tối ưu nhất" }
  ];

  const handleRemoveFile = (fileName: string) => {
    dispatch(removeFile(fileName));
  };

  const handleClearAll = () => {
    dispatch(clearFiles());
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedModel(event.target.value));
  };

  const handleExtractFile = async (fileName: string) => {
    try {
      await extractData(fileName, selectedModel);
      setToast({
        show: true,
        message: 'File extracted successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to extract file',
        type: 'danger'
      });
    }
  };

  const handleExtractAll = async () => {
    try {
      const extractPromises = files.map(file => extractData(file.name, selectedModel));
      await Promise.all(extractPromises);
      setToast({
        show: true,
        message: 'All files extracted successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to extract files',
        type: 'danger'
      });
    }
  };

  const convertToFileWithStatus = (file: FilePreview): FileWithStatus => ({
    ...file,
    file: file.file || new File([], file.name),
    status: file.status || 'idle'
  });

  return (
    <div className="mt-4">
      {toast.show && (
        <Toast 
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          show={toast.show}
          delay={3000}
          autohide
          className={`bg-${toast.type} text-white`}
        >
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      )}

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Form.Select
              value={selectedModel}
              onChange={handleModelChange}
              className="me-3"
              style={{ width: 'auto' }}
            >
              {availableModels.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </Form.Select>
            {files.length > 0 && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleExtractAll}
              >
                Extract All Files
              </Button>
            )}
          </div>
          {files.length > 0 && (
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </Card.Header>

        <ListGroup variant="flush">
          {files.map((file) => (
            <ListGroup.Item key={file.name}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0">{file.name}</p>
                  <small className="text-muted">
                    Size: {file.size} KB | Status: {file.status || 'idle'}
                  </small>
                </div>
                <div>
                  {!file.extractedData && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleExtractFile(file.name)}
                      disabled={file.status === 'loading'}
                    >
                      {file.status === 'loading' ? 'Extracting...' : 'Extract'}
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveFile(file.name)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              
              {file.status === 'success' && file.extractedData && (
                <ExtractedDataTable
                  file={convertToFileWithStatus(file)}
                  extractResponse={file.extractedData}
                  groupId={selectedGroupId || undefined}
                  onRemoveFile={handleRemoveFile}
                  onSubmitFile={createInvoice}
                  onApproveFile={approveInvoice}
                />
              )}

              {file.status === 'error' && (
                <Alert variant="danger" className="mt-2 mb-0">
                  {file.errorMessage || 'An error occurred during extraction'}
                </Alert>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default FileList;