import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Form, Table, Button, Row, Col, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { ExtractedDataTableProps } from '../../../types/FileList';
import FilePreview from './FilePreview';
import { ExtractionData } from '../../../types/ExtractionData';
import { Item } from '../../../types/Invoice';
import { FilePreview as FilePreviewType } from '../../../redux/slices/fileUploadSlice';

interface FormEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

interface FormItem {
  item: string;
  price: number;
  quantity: number;
}

const ExtractedDataTable: React.FC<ExtractedDataTableProps> = ({
  file,
  groupId,
  extractResponse,
  onRemoveFile,
  onSubmitFile,
  onApproveFile,
}) => {
  // Convert file to FilePreviewType
  const filePreview: FilePreviewType = {
    preview: file.preview,
    name: file.name,
    size: file.size, // Already a string from FileWithStatus
    type: 'image/jpeg', // Default to image/jpeg
    status: file.status,
    errorMessage: file.errorMessage,
    extractedData: file.extractedData
  };

  const convertExtractionDataToInvoiceData = (
    extraction: ExtractionData,
    options?: { submittedBy?: string; approvedBy?: string }
  ): import('../../../types/Invoice').InvoiceData => {
    const localInvoiceItems: Item[] = localItems.map(item => ({
      item: item.item,
      price: item.price,
      quantity: item.quantity,
    }));
    
    return {
      id: extraction.id,
      invoice_number: localId,
      group_id: groupId || '',
      model: extraction.model,
      address: localAddress,
      file_name: localFileName,
      store_name: localStoreName,
      status: extraction.status,
      approved_by: options?.approvedBy || extraction.approvedBy || '',
      submitted_by: options?.submittedBy || extraction.submittedBy || '',
      created_date: localCreatedDate,
      update_at: extraction.updateAt,
      total_amount: localTotalAmount,
      image_url: '',
      items: localInvoiceItems,
    };
  };

  const {user} = useAuth();
  const matchedInvoiceData = extractResponse?.find(data => data.fileName === file.name) || null;
  const [localAddress, setLocalAddress] = useState<string>("");
  const [localId, setLocalId] = useState<string>("");
  const [localFileName, setLocalFileName] = useState<string>("");
  const [localStoreName, setLocalStoreName] = useState<string>("");
  const [localCreatedDate, setLocalCreatedDate] = useState<string>("");
  const [localTotalAmount, setLocalTotalAmount] = useState<number>(0);
  const [localItems, setLocalItems] = useState<FormItem[]>([]);
  
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  useEffect(() => {
    if (!extractResponse || extractResponse.length <= 0) {
      setLocalAddress("");
      setLocalId("");
      setLocalFileName("");
      setLocalStoreName("");
      setLocalCreatedDate("");
      setLocalTotalAmount(0);
      setLocalItems([]);
    } else {
      const matchedData = extractResponse.find(data => data.fileName === file.name);
      if (matchedData) {
        setLocalAddress(matchedData.address || "");
        setLocalId(matchedData.id || "");
        setLocalFileName(matchedData.fileName || "");
        setLocalStoreName(matchedData.storeName || "");
        setLocalCreatedDate(matchedData.createdDate || "");
        setLocalTotalAmount(matchedData.totalAmount || 0);
        setLocalItems(matchedData.items.map(item => ({
          item: item.item,
          price: item.price,
          quantity: item.quantity
        })));
      }
    }
  }, [file.name, extractResponse]);

  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setLocalCreatedDate(formattedDate);
      handleFieldChange('createdDate', formattedDate);
      return formattedDate;
    }
  
    return dateString;
  };

  const handleFieldChange = (field: string, value: string | number) => {
    if (matchedInvoiceData) {
      if (field === 'address') {
        setLocalAddress(value as string);
      }
      else if (field === 'id') {
        setLocalId(value as string);
      }
      else if (field === 'fileName') {
        setLocalFileName(value as string);
      }
      else if (field === 'storeName') {
        setLocalStoreName(value as string);
      }
      else if (field === 'createdDate') {
        setLocalCreatedDate(value as string);
      }
      else if (field === 'totalAmount') {
        setLocalTotalAmount(Number(value));
      }
    }
  };

  const handleInputChange = (e: FormEvent, field: string) => {
    handleFieldChange(field, e.target.value);
  };

  const handleSubmit = async () => {
    const latestMatched = extractResponse?.find(data => data.fileName === file.name);
    if (latestMatched && user?.$id) {
      setIsSubmitting(true); 
      const invoiceToSubmit = convertExtractionDataToInvoiceData(latestMatched, { submittedBy: user.$id });
      try {
        await onSubmitFile(invoiceToSubmit, file.file);
        setShowSubmitModal(true); 
        return invoiceToSubmit;
      }
      catch (error) {
        alert('Có lỗi xảy ra: ' + error);
        return null;
      } finally {
        setIsSubmitting(false); 
      }
    } else {
      alert('Vui lòng đăng nhập để submit hoá đơn');
      return null;
    }
  };
  
  const handleApprove = async () => {
    if (matchedInvoiceData && user?.$id) {
      setIsApproving(true); 
      try {
        const submittedInvoice = await handleSubmit();
        
        if (submittedInvoice) {
          const invoiceToApprove = {
            ...submittedInvoice,
            approved_by: user.$id
          };
          
          await onApproveFile(invoiceToApprove.id || '');
          setShowApproveModal(true); 
        } else {
          throw new Error('Không thể submit hoá đơn');
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi approve: ' + error);
      } finally {
        setIsApproving(false); 
      }
    } else {
      alert('Vui lòng đăng nhập để approve hoá đơn');
    }
  };

  const handleAddItem = () => {
    const newItems = [...localItems, { item: '', price: 0, quantity: 0 }];
    setLocalItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = localItems.filter((_, i) => i !== index);
    setLocalItems(newItems);
  };

  const handleUpdateItem = (index: number, field: keyof FormItem, value: string) => {
    const newItems = [...localItems];
    if (field === 'item') {
      newItems[index] = { ...newItems[index], [field]: value };
    } else {
      const numValue = value === '' ? 0 : Number(value);
      newItems[index] = { ...newItems[index], [field]: numValue };
    }
    setLocalItems(newItems);
  };

  const handleRandomId = () => {
    const newId = generateRandomId();
    setLocalId(newId);
  };

  if (!matchedInvoiceData) {
    return <div className="mt-3 border rounded p-3">Không có dữ liệu</div>;
  }

  return (
    <div className="mt-3 border rounded p-2 p-md-3">
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small">Tên hoá đơn</Form.Label>
            <Form.Control 
              type="text" 
              value={matchedInvoiceData?.fileName || ''} 
              onChange={(e: FormEvent) => handleInputChange(e, 'fileName')}
              className="form-control-sm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small">Cửa hàng</Form.Label>
            <Form.Control 
              type="text" 
              value={matchedInvoiceData?.storeName || ''} 
              onChange={(e: FormEvent) => handleInputChange(e, 'storeName')}
              className="form-control-sm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small" style={{color: '#000'}}>Số hoá đơn</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                type="text"
                value={localId}
                onChange={(e: FormEvent) => handleInputChange(e, 'id')}
                maxLength={25}
                className="form-control-sm"
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleRandomId}
              >
                Random
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Địa chỉ</strong></Form.Label>
            <Form.Control 
              type="text" 
              value={matchedInvoiceData?.address || ''}
              onChange={(e: FormEvent) => handleInputChange(e, 'address')}
              className="form-control-sm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Ngày tạo</strong></Form.Label>
            <Form.Control 
              type="text" 
              value={formatDateForInput(matchedInvoiceData?.createdDate) ?? ''}
              onChange={(e: FormEvent) => handleInputChange(e, 'createdDate')}
              className="form-control-sm"
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <FilePreview file={filePreview} width="300px" height="300px"/>
        </Col>
      </Row>

      <h5 className="mb-3">Chi tiết sản phẩm</h5>
      <div className="table-responsive">
        <Table striped bordered hover responsive size="sm" className="mt-3 mt-md-0 text-center">
          <thead>
            <tr>
              <th className="small text-center">Tên sản phẩm</th>
              <th className="small text-center" style={{ width: "100px" }}>Số lượng</th>
              <th className="small text-center" style={{ width: "120px" }}>Đơn giá</th>
              <th className="small text-center" style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {localItems.map((item, index) => (
              <tr key={index}>
                <td className="align-middle">
                  <Form.Control
                    type="text"
                    value={item.item}
                    onChange={(e: FormEvent) => handleUpdateItem(index, 'item', e.target.value)}
                    className="form-control-sm text-center"
                  />
                </td>
                <td className="align-middle">
                  <Form.Control
                    type="number"
                    value={item.quantity.toString()}
                    onChange={(e: FormEvent) => handleUpdateItem(index, 'quantity', e.target.value)}
                    className="form-control-sm text-center"
                  />
                </td>
                <td className="align-middle">
                  <Form.Control
                    type="number"
                    value={item.price.toString()}
                    onChange={(e: FormEvent) => handleUpdateItem(index, 'price', e.target.value)}
                    className="form-control-sm text-center"
                  />
                </td>
                <td className="align-middle">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1"
                  >
                    ×
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 mt-3">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleAddItem}
        >
          + Thêm sản phẩm
        </Button>
        
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang lưu...
              </>
            ) : (
              'Lưu'
            )}
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={handleApprove}
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Đang duyệt...
              </>
            ) : (
              'Duyệt'
            )}
          </Button>
        </div>
      </div>

      <div className="text-center mt-3">
        <Button 
          variant="danger" 
          size="sm"
          onClick={() => onRemoveFile(file.name)}
        >
          Xoá hoá đơn này
        </Button>
      </div>

      <Modal 
        show={showSubmitModal} 
        onHide={() => setShowSubmitModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '48px' }}></i>
            <p className="mt-3">Hoá đơn đã được submit thành công!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSubmitModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={showApproveModal} 
        onHide={() => setShowApproveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '48px' }}></i>
            <p className="mt-3">Hoá đơn đã được approve thành công!</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowApproveModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExtractedDataTable;
