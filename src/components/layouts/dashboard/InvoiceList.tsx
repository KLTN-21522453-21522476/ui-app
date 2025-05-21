import React, { useState } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Spinner, Collapse } from 'react-bootstrap';
import { ExtractionData } from '../../../types/ExtractionData';
import TruncatedText from '../../commons/TruncatedText';

interface InvoiceListProps {
  invoices: ExtractionData[];
  isLoading: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.createdDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInvoice = (id: string) => {
    console.log(`View invoice: ${id}`);
    // Navigate to invoice detail page
  };

  const handleDownloadInvoice = (id: string) => {
    console.log(`Download invoice: ${id}`);
    // Download invoice logic
  };

  const handleDeleteInvoice = (id: string) => {
    console.log(`Delete invoice: ${id}`);
    // Delete invoice logic
  };

  const toggleInvoiceExpand = (id: string) => {
    setExpandedInvoiceId(expandedInvoiceId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejectted':
        return <Badge bg="danger">Rejectted</Badge>;
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
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Đang tải hoá đơn...</p>
          </div>
        ) : (
          <Table hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th></th>
                <th>ID Hoá Đơn</th>
                <th>Tên Hoá Đơn</th>
                <th>Cửa Hàng</th>
                <th>Địa chỉ</th>
                <th>Ngày Tạo</th>
                <th>Tổng Cộng</th>
                <th>Trạng Thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <React.Fragment key={invoice.id || 'Không xác định'}>
                    <tr>
                      <td>
                        <Button 
                          variant="link" 
                          onClick={() => toggleInvoiceExpand(invoice.id)}
                          aria-expanded={expandedInvoiceId === invoice.id}
                          className="p-0"
                        >
                          {expandedInvoiceId === invoice.id ? 
                            <img 
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADkElEQVR4nO2aS29NURTHf4L2ClG9LW2MdCgVfAm0HvGYlZqRmqimTD3GZSSR+BykmhJEgniWilCqI3QgmLltU3Jlxf8kK9zHed17D/FPTvrYa6+91tlrr9c+8B//LvLAPuA8MApMAV+BBT32+2uNGc1eoJWMIAccBq4DP4BixOc7MA70A82NUGAFcBKYdULNA7eA09qZjXrjy/W06n82dga4rTnB/I/AsF5OXbALmHECPAaOAC0xeK0BjgJPHL93QC81hL2py27Bp8D2FPn3AM8c/0u12J1OCW4LfAOOA0vTXoRfPE8ABbfbHWkx79J2F+V1NlF7bAbeaM1pyZAIax3DR0A79UMrcFdrz8gqYiHnzOk+sJL6YyXwwJlZrDNz2ZmTBbtGoc1ZhTmAyC42ONj1OBNhzkxBMpl3Cx3sgjhh3ikrGHKHP5SJnXJxohYuNi6WAc8lmylVEc1KFYx4G9nDTsk2W21X+p2HyCKWOE96sBLhDRFZ7pRVDEjGsXIEeaXV8zETwHoGygVgsZyc+6XpTbKPO5J1T6nBCxq0eiLrOCdZR0oNjmrQStAwmABeJMmBHIzHJPAwJH1gPVdLDb7VoFVxYTDpUpgkynSKh/GyeiQMukVvfYE/8EWDYfOqdcBLzbFcaD3R0eF4mFBhebRrzqdSgwsabIogSBJl4ioRBO6gT5CKInGVSaJEVUWimlZcZZIqERR8ZU0r6mGvdGjLOYAwNIkPe1T3G3Vn0tiJAAfE5woVAqI1z5Kg1FtPaydCBcR9GrQOYFL8LniaSlRNUVpd0mgdwDSVSVOJvEsaV5cjGtei1sYkxdRjMiUlDMck4zUq4JCIrBeb1cJqQjL2VQs0H0S4g+xht2R7H+YaYljEExlsPkxKtsEwE3Ku12sN5axg2MWn0JdCvZpUUHOs0dgKzEmmyFcZl9wbsLZlo7BWTTmT5WIcBjm1hYpqJDeiib1KVWNRP5uTvI0pd61gf9cLeeCeu45LfOHT5bbWzGwL9TkT01rTsvINaTHucGZWUO/V3GHaWCbvNOfMyTLqVJFzDqCohnJvihHbrjKCOBEc7Jrevfe4bQ+69gMxv2LIK3cK0o6iTCnN2+KquzPk0pmiMlJLr8+q79Qtt92kp02XRgdEc8f1CYK0Y7BRX0A0qys+phIg6icci6pM+xqlQCm0qNAZUQfQ6o/P7qMa+/2VytMR0ZatJ/6Dvxw/AWAJTkQsYaz2AAAAAElFTkSuQmCC" 
                              alt="circled-chevron-down"
                              style={{ width: '20px', height: '20px' }}
                            />
                            : 
                            <img 
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADdElEQVR4nO2ayWsUQRTGf6JmRhRjxsSIJz1KRP0r1BD3m9tNiRdjiF5dztGTEMjfoYQQRUVQcY0LotGYk8tBjDcnBpWRh1/DQ2cmMz3VPZ2QD5pZXvWrqn5LvfqqYRELFwVgP3AJGAEmgG/ArC77/kYya7MPaCMjyAPHgOvAb6BU5/ULGAOOArlmTGAFcAb47Ab1A7gFnJNlNuuJL9fVpv9Mdh64rXui+z8BA3o4qaAHmHIDeAwcB1pj6FoDnACeOH3vgW4ShD2pYdfhU2BHQP27gGdO/1AS1lmvgVsH34FTwNLQnfBX52mg6KzdGUr5Jpm7pKyzheSxFXirPic1hobQ4RQ+AtpJD23AXfU9Ja+Ihbxzp/vAStLHSuCBc7NYMTPs3MkWu2ZhrfMKSwB1p9gosNOIiVpipqgxWXarebGL1gnLTllBvwv+mlzsrFsn4qbYceBlIwFaBsuA5xqbTaoq8q7saGSxe+HiK+RkuqX341y12VGXIRrBek0i9GSWuEx6uFrDG2pktVOjWAe8kj7LOhsIg17pHK3UoKCy+kfMAjAty7Rpf/Oz0jgPqMObhEUSlrkjfXvKCS9LaPuJ0AhtmYvSNVhOOCLhXpJBSMsckJ6r5YTvJLRdXFIIZZku6TBe4D9MS5h0XRXCMu26/0s54ayELSQPbxlbPOtFzvEEmZmIlR1BJzKdkmt1OteaiOlaHdVca8EE+4iExgBm1RIRDlZLv9GCaOTZvF4Q90tobGFWLfFvibKbCsVYVDQaA5jVorHgisbVlRqNqVOjMbNoCcNJ6bSYrogjamRcbFY3VuPSe2iure4nNdyZwa1uj/R+qOUYYkCNxxsgHx6KkA5NPrzQ2PpquSHvuF4jlLOCAVdo5uplK4oix5qN7cBMXHZnyD0Box2bhQ6RcjaWK3EU5EULlUQkN4PEXqV4K+kz18jTmHDHCvY7LRSAe+44ruEDn03OtOZm20gnJibVp1XlG0Mp7nRuVhT3aukwNJYpO804d7KtcVDkXQKIdnbdAVdsW+yidSIK7ETP3nc5s0esfW/MtxgKqp2isqMkVwp5WjyndfrFikcDmFV5fUG8U5fSdouutTo0Oqg2dxxPEJUdfc16AyInVnxUW4B6X+H4qSr2ULMmUA6t4mJt13ZNBeNX91KNfX+t7emg2lbcTyyCeY4/F5VOQDaUwpAAAAAASUVORK5CYII=" 
                              alt="circled-chevron-right--v1"
                              style={{ width: '20px', height: '20px' }}
                            />
                          }
                        </Button>
                      </td>
                      <td>
                        <TruncatedText 
                          text={invoice.id || 'Không xác định'} 
                          maxLength={10}
                        />
                      </td>
                      <td>
                        <TruncatedText 
                          text={invoice.fileName || 'Không xác định'} 
                          maxLength={10}
                        />
                      </td>
                      <td>
                        <TruncatedText 
                          text={invoice.storeName || 'Không xác định'} 
                          maxLength={10}
                        />
                      </td>
                      <td>
                        <TruncatedText 
                          text={invoice.address || 'Không xác định'} 
                          maxLength={10}
                        />
                      </td>
                      <td>{invoice.createdDate || 'Không xác định'}</td>
                      <td>{invoice.totalAmount || 0} VNĐ</td>
                      <td>{getStatusBadge(invoice.status) || 'Không xác định'}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          👁️
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          ⬇️
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9} className="p-0">
                        <Collapse in={expandedInvoiceId === invoice.id}>
                          <div>
                            <div className="bg-light p-3">
                              <h6 className="mb-3">Danh sách sản phẩm</h6>
                              {invoice.items && invoice.items.length > 0 ? (
                                <Table bordered hover size="sm">
                                  <thead>
                                    <tr>
                                      <th>Tên sản phẩm</th>
                                      <th>Đơn giá</th>
                                      <th>Số lượng</th>
                                      <th>Thành tiền</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.items.map((item, index) => (
                                      <tr key={index}>
                                        <td>
                                          <TruncatedText 
                                            text={item.item || 'Không xác định'} 
                                            maxLength={25}
                                          />
                                        </td>
                                        <td>{item.price?.toLocaleString() || 0} VNĐ</td>
                                        <td>{item.quantity || 0}</td>
                                        <td>{((item.price || 0) * (item.quantity || 0)).toLocaleString()} VNĐ</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              ) : (
                                <p className="text-muted">Không có sản phẩm nào</p>
                              )}
                            </div>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    Không có hoá đơn nào khớp dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <Card.Footer className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Hiển thị {filteredInvoices.length} trên tổng {invoices.length} hoá đơn</span>
          <div>
            <Button variant="outline-primary" size="sm">
              Xem tất cả hoá đơn
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default InvoiceList;
