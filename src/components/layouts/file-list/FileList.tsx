// src/components/FileList.tsx

import React, { useState } from 'react';
import { Card, ListGroup, Button, Alert, Toast, Form, Row, Col, Badge } from 'react-bootstrap';
import { FileListProps } from '../../../types/FileList';
import { useFileStatus } from '../../../hooks/useFileStatus';
import { useFileExtraction } from '../../../hooks/useFileExtraction';
import { useInvoices } from '../../../hooks/useInvoices';
import FilePreview from './FilePreview';
import ExtractedDataTable from './ExtractedDataTable';

const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  onClearAll,
}) => {
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'danger'}>({
    show: false,
    message: '',
    type: 'success'
  });

  const [selectedModel, setSelectedModel] = useState<string>("yolo8");
  const availableModels = [
    { value: "yolo8", label: "YOLO 8", description: "Phiên bản cơ bản, phù hợp với hầu hết các hóa đơn" },
    { value: "yolo8v6", label: "YOLO 8v6", description: "Phiên bản cải tiến của YOLO 8" },
    { value: "yolo10", label: "YOLO 10", description: "Phiên bản mới, độ chính xác cao hơn" },
    { value: "yolo11", label: "YOLO 11", description: "Phiên bản mới nhất, tối ưu nhất" }
  ];

  const { submitInvoice, approveInvoice } = useInvoices();

  // Initialize file status management
  const { 
    filesWithStatus, 
    updateFileStatus, 
    updateExtractedData, 
    updateInvoiceData,
  } = useFileStatus(files);

  // Initialize file extraction with the updated hooks
  const {
    extractedDataList,
    extractData,
    handleDataChange,
    handleInvoiceDataUpdate,
  } = useFileExtraction(
    filesWithStatus,
    updateFileStatus,
    updateExtractedData,
    updateInvoiceData,
  );

  // Process a single file
  const processFile = async (fileName: string) => {
    await extractData(fileName, selectedModel);
  };

  // Process all files
  const processAllFiles = async () => {
    for (const file of filesWithStatus) {
      if (file.status === 'idle' || file.status === 'error') {
        await extractData(file.name, selectedModel);
      }
    }
  };

  // Save all processed data
  const saveAllData = async () => {
    try {
      // Here you would implement the logic to save all data to your backend
      // For now, we'll just simulate a successful save
      
      // Check if there are any files that have been successfully processed
      const successFiles = filesWithStatus.filter(file => file.status === 'success');
      
      if (successFiles.length === 0) {
        return {
          success: false,
          message: 'Không có dữ liệu nào để lưu. Vui lòng xử lý ít nhất một tệp.'
        };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Đã lưu thành công ${successFiles.length} tệp.`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lưu dữ liệu.'
      };
    }
  };

  const handleSaveAll = async () => {
    const result = await saveAllData();
    setToast({
      show: true,
      message: result.message,
      type: result.success ? 'success' : 'danger'
    });
    
    // Auto hide toast after 3 seconds
    setTimeout(() => setToast(prev => ({...prev, show: false})), 3000);
  };

  const hasSuccessfulFiles = filesWithStatus.some(file => file.status === 'success');
  const hasLoadingFiles = filesWithStatus.some(file => file.status === 'loading');

  return (
    <>
      <Card className="mt-4 p-3 shadow-sm">
        
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Cấu hình trích xuất</h5>
        </Card.Header>
        
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Chọn model trích xuất</strong></Form.Label>
                <Form.Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mb-2"
                >
                  {availableModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </Form.Select>
                <div className="d-flex align-items-center mt-2">
                  <Badge bg="info" className="me-2">Đang sử dụng</Badge>
                  <span className="fw-bold">{availableModels.find(m => m.value === selectedModel)?.label}</span>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="p-3 bg-light rounded">
                <h6>Thông tin model</h6>
                <p className="mb-0 small">
                  {availableModels.find(m => m.value === selectedModel)?.description}
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>

        <ListGroup variant="flush">
          {filesWithStatus.map((file) => (
          <ListGroup.Item
            key={file.name}
            className="d-flex flex-column"
          >
            {file.status !== 'success' && !file.extractedData ? (
              // Show this section only when status is not success
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <FilePreview file={file} />
                  <div className="ms-3">
                    <h5 className="mb-1">{file.name}</h5>
                    <p className="text-muted mb-0">{file.size}</p>
                    {file.status === 'error' && (
                      <Alert variant="danger" className="mt-2 mb-0 py-1 px-2">
                        <small>{file.errorMessage || 'Lỗi xử lý tệp'}</small>
                      </Alert>
                    )}
                  </div>
                </div>
                <div>
                  {file.status === 'loading' ? (
                    <Button variant="primary" disabled>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="primary" 
                        className="me-2"
                        onClick={() => processFile(file.name)}
                      >
                        {file.status === 'error' ? 'Thử lại' : 'Xử lý'}
                      </Button>
                      <Button 
                        variant="outline-danger"
                        onClick={() => onRemoveFile(file.name)}
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Show this section when status is success
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <h5 className="mb-1">{file.name}</h5>
                      <p className="text-muted mb-0">{file.size} kB</p>
                    </div>
                  </div>
                </div>
                
                {/* Extracted data table */}
                <ExtractedDataTable 
                  file={file}
                  extractResponse={extractedDataList || []}
                  onUpdateInvoiceData={handleInvoiceDataUpdate}
                  onDataChange={handleDataChange}
                  onRemoveFile={onRemoveFile}
                  onSubmitFile={submitInvoice}
                  onApproveFile={approveInvoice}
                />
              </div>
            )}
          </ListGroup.Item>
          ))}
        </ListGroup>
        
        {filesWithStatus.length > 0 && (
          <div className="d-flex justify-content-between mt-3">
            <div>
              <Button 
                variant="primary" 
                className="me-2" 
                onClick={processAllFiles}
                disabled={hasLoadingFiles}
              >
                Xử lý tất cả
              </Button>
              <Button 
                variant="success" 
                disabled={!hasSuccessfulFiles || hasLoadingFiles}
                onClick={handleSaveAll}
              >
                Lưu tất cả
              </Button>
            </div>
            <Button 
              variant="outline-danger" 
              onClick={onClearAll}
              disabled={hasLoadingFiles}
            >
              Xóa tất cả
            </Button>
          </div>
        )}
      </Card>

      {/* Toast notification */}
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
