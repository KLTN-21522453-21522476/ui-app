// src/components/FileList.tsx

import React, { useState } from 'react';
import { Card, ListGroup, Button, Alert, Toast, Form, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { 
  removeFile, 
  clearFiles, 
  updateFileStatus, 
  setSelectedModel,
  updateExtractedData,
  type FilePreview as FilePreviewType 
} from '../../../redux/slices/fileUploadSlice';
import FilePreviewComponent from './FilePreview';
import ExtractedDataTable from './ExtractedDataTable';
import { RootState } from '../../../redux/store';
import { useInvoices } from '../../../hooks/useInvoices';

const FileList: React.FC = () => {
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.fileUpload.files);
  const selectedModel = useSelector((state: RootState) => state.fileUpload.selectedModel);
  const selectedGroupId = useSelector((state: RootState) => state.groups.selectedGroupId || '');
  
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'danger'}>({
    show: false,
    message: '',
    type: 'success'
  });

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

  const processFile = async (fileName: string) => {
    try {
      dispatch(updateFileStatus({ fileName, status: 'loading' }));
      
      // Simulate API call for file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated successful response
      const mockExtractedData = {
        invoiceNumber: 'INV-001',
        date: new Date().toISOString(),
        amount: 1000,
        // Add other extracted fields as needed
      };
      
      dispatch(updateExtractedData({ fileName, data: mockExtractedData }));
      dispatch(updateFileStatus({ fileName, status: 'success' }));
    } catch (error) {
      dispatch(updateFileStatus({ 
        fileName, 
        status: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Processing failed' 
      }));
    }
  };

  const processAllFiles = async () => {
    for (const file of files) {
      if (file.status === 'idle' || file.status === 'error') {
        await processFile(file.name);
      }
    }
  };

  const handleSaveAll = async () => {
    try {
      const successFiles = files.filter(file => file.status === 'success');
      
      if (successFiles.length === 0) {
        setToast({
          show: true,
          message: 'Không có dữ liệu nào để lưu. Vui lòng xử lý ít nhất một tệp.',
          type: 'danger'
        });
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setToast({
        show: true,
        message: `Đã lưu thành công ${successFiles.length} tệp.`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lưu dữ liệu.',
        type: 'danger'
      });
    }
    
    setTimeout(() => setToast(prev => ({...prev, show: false})), 3000);
  };

  const hasSuccessfulFiles = files.some(file => file.status === 'success');
  const hasLoadingFiles = files.some(file => file.status === 'loading');

  if (files.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mt-4">
        <Card.Header className="bg-light">
          <Form.Group className="mb-3">
            <Form.Label>Chọn mô hình xử lý</Form.Label>
            <Form.Select
              value={selectedModel}
              onChange={(e) => dispatch(setSelectedModel(e.target.value))}
              disabled={hasLoadingFiles}
            >
              {availableModels.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label} - {model.description}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Header>

        <ListGroup variant="flush">
          {files.map((file) => (
            <ListGroup.Item
              key={file.name}
              className="d-flex flex-column p-2 p-md-3"
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 mb-md-0 w-100">
                  <FilePreviewComponent file={file} width="100px" height="100px" />
                  <div className="ms-0 ms-md-3 mt-2 mt-md-0">
                    <h5 className="mb-1 fs-6">{file.name}</h5>
                    <p className="text-muted mb-0 small">{file.size} KB</p>
                    {file.status === 'error' && (
                      <Alert variant="danger" className="mt-2 mb-0 py-1 px-2">
                        <small>{file.errorMessage || 'Lỗi xử lý tệp'}</small>
                      </Alert>
                    )}
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  {file.status === 'loading' ? (
                    <Button variant="primary" disabled size="sm">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </Button>
                  ) : (
                    <>
                      {file.status !== 'success' && (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => processFile(file.name)}
                        >
                          {file.status === 'error' ? 'Thử lại' : 'Xử lý'}
                        </Button>
                      )}
                      <Button 
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {file.status === 'success' && file.extractedData && (
                <ExtractedDataTable 
                  file={file}
                  groupId={selectedGroupId}
                  extractResponse={[file.extractedData]}
                />
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        
        <Card.Footer className="bg-light">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div className="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
              <Button 
                variant="primary" 
                className="w-100 w-md-auto" 
                onClick={processAllFiles}
                disabled={hasLoadingFiles}
                size="sm"
              >
                Xử lý tất cả
              </Button>
              <Button 
                variant="success" 
                className="w-100 w-md-auto"
                disabled={!hasSuccessfulFiles || hasLoadingFiles}
                onClick={handleSaveAll}
                size="sm"
              >
                Lưu tất cả
              </Button>
            </div>
            <Button 
              variant="outline-danger" 
              onClick={handleClearAll}
              disabled={hasLoadingFiles}
              className="w-100 w-md-auto"
              size="sm"
            >
              Xóa tất cả
            </Button>
          </div>
        </Card.Footer>
      </Card>

      <Toast 
        show={toast.show} 
        onClose={() => setToast(prev => ({...prev, show: false}))}
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        bg={toast.type}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Thông báo</strong>
        </Toast.Header>
        <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
          {toast.message}
        </Toast.Body>
      </Toast>
    </>
  );
};

export default FileList;