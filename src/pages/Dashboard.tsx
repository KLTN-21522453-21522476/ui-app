import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InvoiceList from '../components/layouts/dashboard/InvoiceList';
import ProductChart from '../components/layouts/dashboard/ProductChart';
import StoreChart from '../components/layouts/dashboard/StoreChart';
import StatisticCards from '../components/layouts/dashboard/StatisticCards';
import Header from '../components/layouts/Header';
//import { useAuth } from '../hooks/useAuth';
import { InvoiceData } from '../types/Invoice';
import { invoiceApi } from '../api/invoiceApi'

const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getInvoices } = invoiceApi
  //const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices();
        setInvoices(response.results);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleAddInvoice = () => {
    navigate('/upload-invoice');
  };

  return (
    <>
      <Header />
      <Container fluid className="py-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="mb-0">Bảng điều khiển</h2>
            <p className="text-muted">Quản lý danh sách hoá đơn của bạn</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleAddInvoice}>
              Upload Hoá đơn mới
            </Button>
          </Col>
        </Row>

        <StatisticCards invoices={invoices} />

        <Row className="mb-4">
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <h5 className="mb-0">Thống kê</h5>
                <div>
                  <Button variant="outline-secondary" size="sm" className="me-2">
                    Xuất file
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    In
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <ProductChart invoices={invoices} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Biểu đồ các cửa hàng</h5>
              </Card.Header>
              <Card.Body>
                <StoreChart invoices={invoices} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <InvoiceList invoices={invoices} isLoading={isLoading} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
