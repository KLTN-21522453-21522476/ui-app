import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InvoiceList from '../components/layouts/dashboard/InvoiceList';
import ProductChart from '../components/layouts/dashboard/ProductChart';
import StoreChart from '../components/layouts/dashboard/StoreChart';
import StatisticCards from '../components/layouts/dashboard/StatisticCards';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchInvoiceList } from '../redux/slices/invoiceSlice';

// TimeRange type for tracking selected time periods across components
type TimeRange = '7days' | '30days' | '90days' | 'year';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoiceList: { items: invoices }, isLoading, lastFetched } = useAppSelector((state) => state.invoices);
  const navigate = useNavigate();
  
  // State for managing the selected time range across components
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [groupId, setGroupId] = useState<string>('your-group-id'); // Replace with actual group ID from your auth system

  // Function to get date range based on selected time period
  const getDateRange = (range: TimeRange): { startDate: string, endDate: string } => {
    const today = new Date();
    let startDate = new Date();
    
    switch (range) {
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
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    // Check if data doesn't exist or is older than 5 minutes
    const shouldFetch = 
      !invoices.length || 
      !lastFetched || 
      (Date.now() - lastFetched > 5 * 60 * 1000);
    
    if (shouldFetch) {
      dispatch(fetchInvoiceList(groupId));
    }
  }, [dispatch, invoices.length, lastFetched, groupId]);

  const handleAddInvoice = () => {
    navigate('/upload-invoice');
  };

  return (
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

      {/* Time range selector for all dashboard components */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="small text-muted">Khoảng thời gian:</div>
            <ButtonGroup size="sm">
              <Button 
                variant={timeRange === '7days' ? 'primary' : 'outline-primary'} 
                onClick={() => setTimeRange('7days')}
              >
                7 ngày qua
              </Button>
              <Button 
                variant={timeRange === '30days' ? 'primary' : 'outline-primary'} 
                onClick={() => setTimeRange('30days')}
              >
                30 ngày qua
              </Button>
              <Button 
                variant={timeRange === '90days' ? 'primary' : 'outline-primary'} 
                onClick={() => setTimeRange('90days')}
              >
                90 ngày qua
              </Button>
              <Button 
                variant={timeRange === 'year' ? 'primary' : 'outline-primary'} 
                onClick={() => setTimeRange('year')}
              >
                1 năm qua
              </Button>
            </ButtonGroup>
          </div>
        </Card.Body>
      </Card>

      {/* Statistics cards */}
      <StatisticCards invoices={invoices} timeRange={timeRange} groupId={groupId} />

      <Row className="mb-4">
        <Col lg={8}>
          {/* Remove the card wrapper since ProductChart now already has its own card wrapper */}
          <ProductChart groupId={groupId} />
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Biểu đồ các cửa hàng</h5>
            </Card.Header>
            <Card.Body>
              <StoreChart invoices={invoices} timeRange={timeRange} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <InvoiceList 
            invoices={invoices.map(invoice => ({
              model: '',
              address: '',
              fileName: invoice.invoice_number,
              storeName: invoice.store_name,
              createdDate: invoice.created_date,
              id: invoice.id,
              status: invoice.status,
              approvedBy: '',
              submittedBy: '',
              updateAt: invoice.created_date,
              items: [],
              totalAmount: invoice.total_amount
            }))}
            isLoading={isLoading} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
