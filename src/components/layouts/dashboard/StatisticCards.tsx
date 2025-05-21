import React, { useMemo, useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { MarketShareResponse } from '../../../api/statisticsApi';
import { statisticsApi } from '../../../api/statisticsApi';
import { ExtractionData } from '../../../types/ExtractionData';

interface StatisticCardsProps {
  invoices: ExtractionData[];
  groupId: string;
  timeRange: '7days' | '30days' | '90days' | 'year';
}

const StatisticCards: React.FC<StatisticCardsProps> = ({ invoices, groupId, timeRange }) => {
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

  const [marketShareData, setMarketShareData] = useState<MarketShareResponse['data']>([]);
  const [loading, setLoading] = useState(true);

  // Function to generate date range based on the time range selection
  const getDateRange = () => {
    const today = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(today.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }
    
    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    const fetchMarketShare = async () => {
      setLoading(true);
      try {
        const dateRange = getDateRange();
        const response = await statisticsApi.getMarketShare({
          group_id: groupId,
          min_percentage: 1, // Show stores with at least 1% market share
          start_date: dateRange.start_date,
          end_date: dateRange.end_date
        });
        setMarketShareData(response.data);
      } catch (error) {
        console.error('Error fetching market share:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketShare();
  }, [groupId, timeRange]);

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
