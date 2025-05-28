import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Form, Table, Button, Row, Col, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import { ExtractedDataTableProps } from '../../../types/FileList';
import FilePreview from './FilePreview';
import { ExtractionData } from '../../../types/ExtractionData';
import VietnameseInput from '../../commons/VietnameseInput '
import { Item } from '../../../types/Invoice';

const ExtractedDataTable: React.FC<ExtractedDataTableProps> = ({
  file,
  groupId,
  extractResponse,
  onRemoveFile,
  onSubmitFile,
  onApproveFile,
}) => {
  const convertExtractionDataToInvoiceData = (
    extraction: ExtractionData,
    options?: { submittedBy?: string; approvedBy?: string }
  ): import('../../../types/Invoice').InvoiceData => {
    const localInvoiceItems = localItems.map(item => ({
      item: item.item,
      price: Number(item.price),
      quantity: Number(item.quantity),
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
  // Always use latest invoice data from extractResponse
  const matchedInvoiceData = extractResponse?.find(data => data.fileName === file.name) || null;
  const [localAddress, setLocalAddress] = useState<string>("");
  const [localId, setLocalId] = useState<string>("");
  const [localFileName, setLocalFileName] = useState<string>("");
  const [localStoreName, setLocalStoreName] = useState<string>("");
  const [localCreatedDate, setLocalCreatedDate] = useState<string>("");
  const [localTotalAmount, setLocalTotalAmount] = useState<number>(0);
  const [localItems, setLocalItems] = useState<Item[]>([]);
  
  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  
  // Loading states
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
        setLocalItems(matchedData.items || []);
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

  const handleSubmit = async () => {
    const latestMatched = extractResponse?.find(data => data.fileName === file.name);
    if (latestMatched && user?.$id) {
      setIsSubmitting(true); 
      const invoiceToSubmit = convertExtractionDataToInvoiceData(latestMatched, { submittedBy: user.$id });
      try{
        await onSubmitFile(invoiceToSubmit, file.file);
        setShowSubmitModal(true); 
        return invoiceToSubmit;
      }
      catch (error){
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

  const handleUpdateItem = (index: number, updatedItem: Item) => {
    const newItems = [...localItems];
    newItems[index] = updatedItem;
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
    <div className="mt-3 border rounded p-3">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Tên hoá đơn</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={matchedInvoiceData?.fileName || ''} 
              onChange={(e) => handleFieldChange('fileName', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Cửa hàng</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={matchedInvoiceData?.storeName || ''} 
              onChange={(e) => handleFieldChange('storeName', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color: '#000'}}><strong>Số hoá đơn</strong></Form.Label>
            <InputGroup>
              <VietnameseInput
                type="text"
                value={localId}
                onChange={(e) => handleFieldChange('id', e.target.value)}
                maxLength={25}
              />
              <Button
                variant="outline-secondary"
                onClick={handleRandomId}
              >
                Random
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Địa chỉ</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={matchedInvoiceData?.address || ''}
              onChange={(e) => handleFieldChange('address', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Ngày tạo</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={formatDateForInput(matchedInvoiceData?.createdDate) ?? ''}
              onChange={(e) => handleFieldChange('createdDate', e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <FilePreview file={file} width={300} height={300}/>
        </Col>
      </Row>

      <h5 className="mb-3">Chi tiết sản phẩm</h5>
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {localItems.map((item, index) => (
            <tr key={index}>
              <td>
                <VietnameseInput 
                  type="text" 
                  value={item.item || ''} 
                  onChange={(e) => handleUpdateItem(index, { ...item, item: e.target.value })}
                />
              </td>
              <td>
                <FormControl 
                  type="number" 
                  value={item.price} 
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    handleUpdateItem(index, { ...item, price: value });
                  }}
                />
              </td>
              <td>
                <FormControl
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    handleUpdateItem(index, { ...item, quantity: value });
                  }}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleRemoveItem(index)}>Xoá</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={handleAddItem} className="mb-3">
        + Thêm sản phẩm
      </Button>

      <Form.Group className="mb-3">
        <Form.Label><strong>Tổng cộng</strong></Form.Label>
          <FormControl 
            type="number" 
            value={localTotalAmount} 
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : Number(e.target.value);
              handleFieldChange('totalAmount', value);
            }}
            className="bg-light"
          />
      </Form.Group>

      <div className="d-flex justify-content-end mt-3">
        <Button 
          variant="success" 
          className="me-3" 
          onClick={handleApprove}
          disabled={user?.$id == null || isApproving}
        >
          {isApproving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Đang xử lý...
            </>
          ) : (
            'Approve hoá đơn'
          )}
        </Button>
        <Button 
          variant="success" 
          className="me-3" 
          onClick={handleSubmit}
          disabled={user?.$id == null || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Đang xử lý...
            </>
          ) : (
            'Submit hoá đơn'
          )}
        </Button>
        <Button variant="danger" onClick={() => onRemoveFile(file.name)}>
          Xoá hoá đơn này
        </Button>
      </div>

      {/* Modal thông báo submit thành công */}
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

      {/* Modal thông báo approve thành công */}
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
