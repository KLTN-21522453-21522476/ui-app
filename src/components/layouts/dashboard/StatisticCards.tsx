import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { statisticsApi } from '../../../api/statisticsApi';

interface StatisticCardsProps {
  groupId?: string;
  data?: StatsType;
}

interface StatsType {
  totalInvoices: number;
  uniqueStores: number;
  totalProducts: number;
  totalAmount: number;
}

const StatisticCards: React.FC<StatisticCardsProps> = ({ groupId, data }) => {
  const [stats, setStats] = useState<StatsType>(data ?? {
    totalInvoices: 0,
    uniqueStores: 0,
    totalProducts: 0,
    totalAmount: 0
  });
  
  const formatNumber = (num: number): string => {
    return num === 0 ? '00.00' : num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setStats(data);
      setLoading(false);
      return;
    }
    if (!groupId) return;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await statisticsApi.getInvoiceStatistics(groupId);
        setStats({
          totalInvoices: response.invoices,
          uniqueStores: response.stores,
          totalProducts: response.products,
          totalAmount: response.total_spent
        });
      } catch (err) {
        console.error('Error fetching invoice statistics:', err);
        setError('Using default values. Failed to fetch latest statistics.');
        // Reset to default values (0) which will be displayed as 00.00
        setStats({
          totalInvoices: 0,
          uniqueStores: 0,
          totalProducts: 0,
          totalAmount: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [groupId, data]);

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
              <h6 className="text-muted mb-1">Invoices</h6>
              <h3 className="mb-0">{formatNumber(stats.totalInvoices)}</h3>
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
              <h3 className="mb-0">{formatNumber(stats.uniqueStores)}</h3>
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
              <h6 className="text-muted mb-1">Products</h6>
              <h3 className="mb-0">{formatNumber(stats.totalProducts)}</h3>
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
              <h6 className="text-muted mb-1">Total Spent</h6>
              <h3 className="mb-0">${formatNumber(stats.totalAmount)}</h3>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards;
