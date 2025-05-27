import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Form, Table, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { ExtractedDataTableProps } from '../../../types/FileList';
import FilePreview from './FilePreview';
import { ExtractionData } from '../../../types/ExtractionData';
import VietnameseInput from '../../commons/VietnameseInput '
import { Item } from '../../../types/Invoice';

const ExtractedDataTable: React.FC<ExtractedDataTableProps> = ({
  file,
  groupId,
  extractResponse,
  onUpdateInvoiceData,
  onRemoveFile,
  onSubmitFile,
  onApproveFile,
}) => {
  const convertExtractionDataToInvoiceData = (
    extraction: ExtractionData,
    options?: { submittedBy?: string; approvedBy?: string }
  ): import('../../../types/Invoice').InvoiceData => {
    return {
      id: extraction.id,
      invoice_number: extraction.id || '',
      group_id: groupId || '',
      model: extraction.model,
      address: extraction.address,
      file_name: extraction.fileName,
      store_name: extraction.storeName,
      status: extraction.status,
      approved_by: options?.approvedBy || extraction.approvedBy || '',
      submitted_by: options?.submittedBy || extraction.submittedBy || '',
      created_date: extraction.createdDate,
      update_at: extraction.updateAt,
      total_amount: extraction.totalAmount,
      image_url: '',
      items: extraction.items.map(item => ({
        item: item.item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    };
  };

  const {user} = useAuth();
  // Always use latest invoice data from extractResponse
  const matchedInvoiceData = extractResponse?.find(data => data.fileName === file.name) || null;
  const [localAddress, setLocalAddress] = useState<string>("");

  useEffect(() => {
    if (!extractResponse || extractResponse.length <= 0) {
      setLocalAddress("");
    } else {
      const matchedData = extractResponse.find(data => data.fileName === file.name);
      setLocalAddress(matchedData?.address || "");
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
      if (field === 'address') {
        setLocalAddress(value);
      }
      setTimeout(() => {
        onUpdateInvoiceData(file.name, { [field]: value });
      }, 0);
    }
  };

  const handleSubmit = async () => {
    const latestMatched = extractResponse?.find(data => data.fileName === file.name);
    if (latestMatched && user?.$id) {
      // Always use the latest local address
      const invoiceToSubmit = convertExtractionDataToInvoiceData({
        ...latestMatched,
        address: localAddress
      }, { submittedBy: user.$id });
      try{
        await onSubmitFile(invoiceToSubmit, file.file);
      }
      catch (error){
        alert('Có lỗi xảy ra: ' + error);
      }
    } else {
      alert('Vui lòng đăng nhập để submit hoá đơn');
    }
  };



  const handleApprove = async () => {
    if (matchedInvoiceData && user?.$id) {
      const invoiceToApprove = convertExtractionDataToInvoiceData(matchedInvoiceData, { approvedBy: user.$id });
      try{
        await onApproveFile(invoiceToApprove.id || '');
      }
      catch (error){
        alert('Có lỗi xảy ra: ' + error);
      }
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

  const handleUpdateItem = (index: number, updatedItem: Item) => {
    if (matchedInvoiceData && matchedInvoiceData.items) {
      handleRemoveItem(index);
      const newItems = [...(matchedInvoiceData.items || []), updatedItem];
      onUpdateInvoiceData(file.name, { items: newItems });
    }
  };

  if (!matchedInvoiceData) {
    return <div className="mt-3 border rounded p-3">Không có dữ liệu</div>;
  } // (No change, just for clarity: matchedInvoiceData is now always from props)


  return (
    <div className="mt-3 border rounded p-3">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Tên hoá đơn</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={matchedInvoiceData.fileName || ''} 
              onChange={(e) => handleFieldChange('fileName', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Cửa hàng</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={matchedInvoiceData.storeName || ''} 
              onChange={(e) => handleFieldChange('storeName', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color: '#fff'}}><strong>ID hoá đơn</strong></Form.Label>
            <InputGroup>
              <VietnameseInput
                type="text"
                value={matchedInvoiceData.id || ''}
                onChange={(e) => handleFieldChange('id', e.target.value)}
                maxLength={25}
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  const newId = generateRandomId();
                  handleFieldChange('id', newId);
                }}
              >
                Random
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Địa chỉ</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={matchedInvoiceData.address || localAddress}
              onChange={(e) => handleFieldChange('address', e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Ngày tạo</strong></Form.Label>
            <VietnameseInput 
              type="text" 
              value={formatDateForInput(matchedInvoiceData.createdDate)} 
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
          {matchedInvoiceData.items?.map((item, index) => (
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
            value={matchedInvoiceData.totalAmount || 0} 
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : Number(e.target.value);
              handleFieldChange('totalAmount', value.toString());
            }}
            className="bg-light"
          />

      </Form.Group>

      <div className="d-flex justify-content-end mt-3">
        <Button 
          variant="success" 
          className="me-3" 
          onClick={handleApprove}
          disabled={user?.$id == null}
        >
          Approve hoá đơn
        </Button>
        <Button 
          variant="success" 
          className="me-3" 
          onClick={handleSubmit}
          disabled={user?.$id == null}
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