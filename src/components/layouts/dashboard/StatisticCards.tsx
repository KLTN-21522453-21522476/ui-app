import React, { useMemo } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { InvoiceData } from '../../../types/Invoice';

interface StatisticCardsProps {
  invoices: InvoiceData[];
}

const StatisticCards: React.FC<StatisticCardsProps> = ({ invoices }) => {
  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    
    // Get unique stores
    const uniqueStores = new Set(invoices.map(invoice => invoice.storeName));
    
    // Count total products
    const totalProducts = invoices.reduce((sum, invoice) => 
      sum + (invoice.items?.length || 0), 0);
    
    // Calculate total amount correctly from totalAmount of each invoice
    const totalAmount = invoices.reduce((sum, invoice) => 
      sum + (invoice.totalAmount || 0), 0);
      
    return {
      totalInvoices,
      uniqueStores: uniqueStores.size,
      totalProducts,
      totalAmount
    };
  }, [invoices]);

  return (
    <Row className="mb-4 g-3">
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-primary">📄</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Invoices</h6>
              <h3 className="mb-0">{stats.totalInvoices}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-success">🏪</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Stores</h6>
              <h3 className="mb-0">{stats.uniqueStores}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-info">📦</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Products</h6>
              <h3 className="mb-0">{stats.totalProducts}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-warning">💰</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Total Spent</h6>
              <h3 className="mb-0">{stats.totalAmount.toLocaleString('vi-VN')} VNĐ</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards;
