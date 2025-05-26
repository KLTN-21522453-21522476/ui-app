import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useStatistic } from '../../../hooks/useStatistic';
import AnimatedNumber from './AnimatedNumber';

interface StatsType {
  totalInvoices: number;
  uniqueStores: number;
  totalProducts: number;
  totalAmount: number;
}

const StatisticCards: React.FC = () => {
  const { invoiceStats, loading, error } = useStatistic();

  // Map invoiceStats from redux to local format
  const stats: StatsType = invoiceStats ? {
    totalInvoices: invoiceStats.invoices || 0,
    uniqueStores: invoiceStats.stores || 0,
    totalProducts: invoiceStats.products || 0,
    totalAmount: invoiceStats.total_spent || 0,
  } : {
    totalInvoices: 0,
    uniqueStores: 0,
    totalProducts: 0,
    totalAmount: 0,
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }


  return (
    <Row className="mb-4 g-3">
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-primary">📄</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Hóa đơn</h6>
              <h3 className="mb-0">
                <AnimatedNumber value={stats.totalInvoices} duration={900} />
              </h3>
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
              <h6 className="text-muted mb-1">Cửa hàng</h6>
              <h3 className="mb-0">
                <AnimatedNumber value={stats.uniqueStores} duration={900} />
              </h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-warning">🛒</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Sản phẩm</h6>
              <h3 className="mb-0">
                <AnimatedNumber value={stats.totalProducts} duration={900} />
              </h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col sm={6} xl={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
              <span className="fs-4 text-info">💰</span>
            </div>
            <div>
              <h6 className="text-muted mb-1">Tổng tiền</h6>
              <h3 className="mb-0">
                <AnimatedNumber value={stats.totalAmount} duration={1200} />
                <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>VNĐ</div>
              </h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards;
