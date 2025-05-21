import React, { useEffect, useState } from 'react';
import { Form, Table, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FileWithStatus } from '../../../types/FileList';
import FilePreview from './FilePreview';
import { ExtractionData, Item } from '../../../types/ExtractionData';
import { ExtractResponse } from '../../../types/FileList';
import VietnameseInput from '../../../components/commons/VietnameseInput .tsx';
import { Models } from 'appwrite';

interface ExtractedDataTableProps {
  file: FileWithStatus;
  extractResponse: ExtractResponse;
  onDataChange: (fileName: string, index: number, field: keyof Item, value: string) => void;
  onRemoveFile: (fileName: string) => void;
  onApproveFile: (data: ExtractionData) => Promise<void>;
  onUpdateInvoiceData: (fileName: string, data: Partial<ExtractionData>) => void;
  onSubmitFile: (data: ExtractionData) => Promise<void>;
  user: Models.User<Models.Preferences> | null;
}

const ExtractedDataTable: React.FC<ExtractedDataTableProps> = ({
  file,
  extractResponse,
  onDataChange,
  onRemoveFile,
  onApproveFile,
  onUpdateInvoiceData,
  onSubmitFile,
  user,
}) => {
  const [matchedInvoiceData, setMatchedInvoiceData] = useState<ExtractionData | null>(null);


  useEffect(() => {
    if (!extractResponse || extractResponse.length <= 0) {
      setMatchedInvoiceData(null);
    } else {
      const matchedData = extractResponse.find(data => data.fileName === file.name);
      setMatchedInvoiceData(matchedData || null);
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
      dateString = `${day}/${month}/${year}`
      handleFieldChange('createdDate', dateString)
    }
  
  return dateString;
};

  const handleFieldChange = (field: string, value: string) => {
    if (matchedInvoiceData) {
      setTimeout(() => {
        onUpdateInvoiceData(file.name, { [field]: value } as Partial<ExtractionData>);
      }, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleFieldChange(name, value);
  };

  const handleSubmit = async () => {
    if (matchedInvoiceData && user?.$id) {
      const invoiceToSubmit = {
        ...matchedInvoiceData,
        submittedBy: user.$id,
      };
      try {
        await onSubmitFile(invoiceToSubmit);
        alert('Submit thành công');
      } catch (error) {
        alert('Có lỗi xảy ra: ' + error);
      }
    } else {
      alert('Vui lòng đăng nhập để submit hoá đơn');
    }
  };

  const handleApprove = async () => {
    if (matchedInvoiceData && user?.$id) {
      const invoiceToApprove = {
        ...matchedInvoiceData,
        approvedBy: user.$id,
      };
      try{
        await onApproveFile(invoiceToApprove);
        alert('Approve thành công');
      }
      catch (error){
        alert('Có lỗi xảy ra: ' + error);
      }
      onApproveFile(invoiceToApprove);
    } else {
      alert('Vui lòng đăng nhập để approve hoá đơn');
    }
  };

  const handleAddItem = () => {
    if (matchedInvoiceData) {
      const newItems = [...(matchedInvoiceData.items || []), { item: '', price: 0, quantity: 0 }];
      onUpdateInvoiceData(file.name, { items: newItems });
    }
  };

  const handleRemoveItem = (index: number) => {
    if (matchedInvoiceData && matchedInvoiceData.items) {
      const newItems = matchedInvoiceData.items.filter((_, i) => i !== index);
      onUpdateInvoiceData(file.name, { items: newItems });
    }
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
              name="fileName"
              value={matchedInvoiceData.fileName || ''} 
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>ID hoá đơn</strong></Form.Label>
            <InputGroup>
              <VietnameseInput 
                type="text" 
                name="id"
                value={matchedInvoiceData.id || ''} 
                onChange={handleInputChange}
                maxLength={25}
              />
              <Button 
                variant="outline-secondary"
                onClick={() => handleFieldChange('id', generateRandomId())}
              >
                Random
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Tên cửa hàng</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              name="storeName"
              value={matchedInvoiceData.storeName || ''} 
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Địa chỉ</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              name="address"
              value={matchedInvoiceData.address || ''} 
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Ngày tạo</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              name="createdDate"
              value={formatDateForInput(matchedInvoiceData.createdDate)} 
              onChange={handleInputChange}
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
          {matchedInvoiceData.items?.map((item, index) => (
            <tr key={index}>
              <td>
                <VietnameseInput 
                  type="text" 
                  name="item"
                  value={item.item || ''} 
                  onChange={(e) => onDataChange(file.name, index, 'item', e.target.value)}
                />
              </td>
              <td>
                <FormControl 
                  type="number"
                  step="1"
                  value={item.price || 0} 
                  onChange={(e) => onDataChange(file.name, index, 'price', e.target.value)}
                />
              </td>
              <td>
                <FormControl 
                  type="number"
                  min="0"
                  step="1" 
                  value={item.quantity || 0} 
                  onChange={(e) => onDataChange(file.name, index, 'quantity', e.target.value)}
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
          value={matchedInvoiceData.totalAmount || 0} 
          onChange={(e) => handleFieldChange('totalAmount', e.target.value)}
          className="bg-light"
        />
      </Form.Group>

      <div className="d-flex justify-content-end mt-3">
        <Button 
          variant="success" 
          className="me-3" 
          onClick={handleApprove}
          disabled={!user?.$id}
        >
          Approve hoá đơn
        </Button>
        <Button 
          variant="success" 
          className="me-3" 
          onClick={handleSubmit}
          disabled={!user?.$id}
        >
          Submit hoá đơn
        </Button>
        <Button variant="danger" onClick={() => onRemoveFile(file.name)}>
          Xoá hoá đơn này
        </Button>
      </div>
    </div>
  );
};

export default ExtractedDataTable;
