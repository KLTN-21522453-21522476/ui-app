import React, { useState } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Collapse } from 'react-bootstrap';
import { mockInvoices, mockInvoiceDetail } from '../../../mock/mockData';

interface Invoice {
  id: string;
  invoice_number: string;
  store_name: string;
  created_date_formatted: string;
  total_amount: number;
  status: string;
}

const InvoiceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const invoices = mockInvoices[0]?.results || [];

  const filteredInvoices = invoices.filter((invoice: Invoice) =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.created_date_formatted.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInvoiceExpand = (id: string) => {
    setExpandedInvoiceId(expandedInvoiceId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Hoá đơn gần đây</h5>
          <InputGroup className="w-auto">
            <Form.Control
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <span>🔍</span>
            </Button>
          </InputGroup>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th></th>
              <th>ID Hoá Đơn</th>
              <th>Số Hoá Đơn</th>
              <th>Cửa Hàng</th>
              <th>Ngày Tạo</th>
              <th>Tổng Cộng</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice: Invoice) => (
                <React.Fragment key={invoice.id || 'Không xác định'}>
                  <tr>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => toggleInvoiceExpand(invoice.id)}
                        aria-expanded={expandedInvoiceId === invoice.id}
                        className="p-0"
                      >
                        {expandedInvoiceId === invoice.id ? (
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADkElEQVR4nO2aS29NURTHf4L2ClG9LW2MdCgVfAm0HvGYlZqRmqimTD3GZSSR+BykmhJEgniWilCqI3QgmLltU3Jlxf8kK9zHed17D/FPTvrYa6+91tlrr9c+8B//LvLAPuA8MApMAV+BBT32+2uNGc1eoJWMIAccBq4DP4BixOc7MA70A82NUGAFcBKYdULNA7eA09qZjXrjy/W06n82dga4rTnB/I/AsF5OXbALmHECPAaOAC0xeK0BjgJPHL93QC81hL2py27Bp8D2FPn3AM8c/0u12J1OCW4LfAOOA0vTXoRfPE8ABbfbHWkx79J2F+V1NlF7bAbeaM1pyZAIax3DR0A79UMrcFdrz8gqYiHnzOk+sJL6YyXwwJlZrDNz2ZmTBbtGoc1ZhTmAyC42ONj1OBNhzkxBMpl3Cx3sgjhh3ikrGHKHP5SJnXJxohYuNi6WAc8lmylVEc1KFYx4G9nDTsk2W21X+p2HyCKWOE96sBLhDRFZ7pRVDEjGsXIEeaXV8zETwHoGygVgsZyc+6XpTbKPO5J1T6nBCxq0eiLrOCdZR0oNjmrQStAwmABeJMmBHIzHJPAwJH1gPVdLDb7VoFVxYTDpUpgkynSKh/GyeiQMukVvfYE/8EWDYfOqdcBLzbFcaD3R0eF4mFBhebRrzqdSgwsabIogSBJl4ioRBO6gT5CKInGVSaJEVUWimlZcZZIqERR8ZU0r6mGvdGjLOYAwNIkPe1T3G3Vn0tiJAAfE5woVAqI1z5Kg1FtPaydCBcR9GrQOYFL8LniaSlRNUVpd0mgdwDSVSVOJvEsaV5cjGtei1sYkxdRjMiUlDMck4zUq4JCIrBeb1cJqQjL2VQs0H0S4g+xht2R7H+YaYljEExlsPkxKtsEwE3Ku12sN5axg2MWn0JdCvZpUUHOs0dgKzEmmyFcZl9wbsLZlo7BWTTmT5WIcBjm1hYpqJDeiib1KVWNRP5uTvI0pd61gf9cLeeCeu45LfOHT5bbWzGwL9TkT01rTsvINaTHucGZWUO/V3GHaWCbvNOfMyTLqVJFzDqCohnJvihHbrjKCOBEc7Jrevfe4bQ+69gMxv2LIK3cK0o6iTCnN2+KquzPk0pmiMlJLr8+q79Qtt92kp02XRgdEc8f1CYK0Y7BRX0A0qys+phIg6icci6pM+xqlQCm0qNAZUQfQ6o/P7qMa+/2VytMR0ZatJ/6Dvxw/AWAJTkQsYaz2AAAAAElFTkSuQmCC"
                          />
                        ) : (
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADkElEQVR4nO2aS29NURTHf4L2ClG9LW2MdCgVfAm0HvGYlZqRmqimTD3GZSSR+BykmhJEgniWilCqI3QgmLltU3Jlxf8kK9zHed17D/FPTvrYa6+91tlrr9c+8B//LvLAPuA8MApMAV+BBT32+2uNGc1eoJWMIAccBq4DP4BixOc7MA70A82NUGAFcBKYdULNA7eA09qZjXrjy/W06n82dga4rTnB/I/AsF5OXbALmHECPAaOAC0xeK0BjgJPHL93QC81hL2py27Bp8D2FPn3AM8c/0u12J1OCW4LfAOOA0vTXoRfPE8ABbfbHWkx79J2F+V1NlF7bAbeaM1pyZAIax3DR0A79UMrcFdrz8gqYiHnzOk+sJL6YyXwwJlZrDNz2ZmTBbtGoc1ZhTmAyC42ONj1OBNhzkxBMpl3Cx3sgjhh3ikrGHKHP5SJnXJxohYuNi6WAc8lmylVEc1KFYx4G9nDTsk2W21X+p2HyCKWOE96sBLhDRFZ7pRVDEjGsXIEeaXV8zETwHoGygVgsZyc+6XpTbKPO5J1T6nBCxq0eiLrOCdZR0oNjmrQStAwmABeJMmBHIzHJPAwJH1gPVdLDb7VoFVxYTDpUpgkynSKh/GyeiQMukVvfYE/8EWDYfOqdcBLzbFcaD3R0eF4mFBhebRrzqdSgwsabIogSBJl4ioRBO6gT5CKInGVSaJEVUWimlZcZZIqERR8ZU0r6mGvdGjLOYAwNIkPe1T3G3Vn0tiJAAfE5woVAqI1z5Kg1FtPaydCBcR9GrQOYFL8LniaSlRNUVpd0mgdwDSVSVOJvEsaV5cjGtei1sYkxdRjMiUlDMck4zUq4JCIrBeb1cJqQjL2VQs0H0S4g+xht2R7H+YaYljEExlsPkxKtsEwE3Ku12sN5axg2MWn0JdCvZpUUHOs0dgKzEmmyFcZl9wbsLZlo7BWTTmT5WIcBjm1hYpqJDeiib1KVWNRP5uTvI0pd61gf9cLeeCeu45LfOHT5bbWzGwL9TkT01rTsvINaTHucGZWUO/V3GHaWCbvNOfMyTLqVJFzDqCohnJvihHbrjKCOBEc7Jrevfe4bQ+69gMxv2LIK3cK0o6iTCnN2+KquzPk0pmiMlJLr8+q79Qtt92kp02XRgdEc8f1CYK0Y7BRX0A0qys+phIg6icci6pM+xqlQCm0qNAZUQfQ6o/P7qMa+/2VytMR0ZatJ/6Dvxw/AWAJTkQsYaz2AAAAAElFTkSuQmCC"
                          />
                        )}
                      </Button>
                    </td>
                    <td>{invoice.id}</td>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.store_name}</td>
                    <td>{invoice.created_date_formatted}</td>
                    <td>{invoice.total_amount}</td>
                    <td>{getStatusBadge(invoice.status)}</td>
                  </tr>
                  {/* Expanded Invoice Detail */}
                  {expandedInvoiceId === invoice.id && (
                    <tr>
                      <td colSpan={7} className="bg-light p-4">
                        <div className="row">
                          <div className="col-md-3 text-center mb-3 mb-md-0">
                            <img
                              src={mockInvoiceDetail.image_url}
                              alt="Invoice"
                              style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, border: '1px solid #eee' }}
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="mb-2 d-flex flex-wrap align-items-center">
                              <span className="fw-bold me-2">Số Hoá Đơn:</span> {mockInvoiceDetail.invoice_number}
                            </div>
                            <div className="mb-2 d-flex flex-wrap align-items-center">
                              <span className="fw-bold me-2">Địa chỉ:</span> {mockInvoiceDetail.address}
                            </div>
                            <div className="mb-2 d-flex flex-wrap align-items-center">
                              <span className="fw-bold me-2">Cửa Hàng:</span> {mockInvoiceDetail.store_name}
                            </div>
                            <div className="mb-2 d-flex flex-wrap align-items-center">
                              <span className="fw-bold me-2">Ngày tạo:</span> {mockInvoiceDetail.created_date_formatted}
                            </div>
                            <div className="mb-2 d-flex flex-wrap align-items-center">
                              <span className="fw-bold me-2">Trạng thái:</span> <span>{getStatusBadge(mockInvoiceDetail.status)}</span>
                            </div>
                            <div className="mb-2 d-flex flex-wrap align-items-center">
                              <span className="fw-bold me-2">Tổng cộng:</span> {mockInvoiceDetail.total_amount.toLocaleString()} đ
                            </div>
                            <div className="mt-3">
                              <h6 className="fw-bold">Danh sách sản phẩm</h6>
                              <Table bordered size="sm" className="mb-0">
                                <thead>
                                  <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {mockInvoiceDetail.items.map((item: any) => (
                                    <tr key={item.id}>
                                      <td>{item.item}</td>
                                      <td>{item.quantity}</td>
                                      <td>{item.price.toLocaleString()} đ</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default InvoiceList;
