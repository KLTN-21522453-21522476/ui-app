import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InvoiceList from '../components/layouts/dashboard/InvoiceList';
import ProductChart from '../components/layouts/dashboard/ProductChart';
import StoreChart from '../components/layouts/dashboard/StoreChart';
import StatisticCards from '../components/layouts/dashboard/StatisticCards';
import MembersSection from '../components/layouts/dashboard/MembersSection';
import { useAuth } from '../hooks/useAuth';
import { useStatistic } from '../hooks/useStatistic';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedGroupId } from '../redux/slices/groupSlice';

// TimeRange type for tracking selected time periods across components
type TimeRange = '7days' | '30days' | '90days' | 'year';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  // Show loading state while checking auth
  if (!isInitialized) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  // Statistic hook
  const { invoiceStats, loading: statsLoading, error: statsError, getInvoiceStatistics } = useStatistic();

  // Sidebar state (Redux-driven)
  const dispatch = useDispatch();
  const selectedGroupId = useSelector((state: any) => state.groups.selectedGroupId);
  const groupDetails = useSelector((state: any) => state.groups.groupDetails);
  const groupList = useSelector((state: any) => state.groups.groupList);
  const isLoadingGroups = useSelector((state: any) => state.groups.isLoading);
  const selectedGroup = selectedGroupId ? groupDetails[selectedGroupId] : null;

  // Dashboard state
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'status'>('date_desc');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    if (!selectedGroupId && groupList.length > 0) {
      dispatch(setSelectedGroupId(groupList[0].id));
    }
  }, [selectedGroupId, groupList, dispatch]);

  // Fetch invoices when selectedGroupId changes
  // Fetch statistics when selectedGroupId changes
  React.useEffect(() => {
    if (selectedGroupId) {
      getInvoiceStatistics(selectedGroupId);
    }
  }, [selectedGroupId, getInvoiceStatistics]);

  // isAdmin function at the top level
  const isAdmin = (): boolean => {
    if (!user || !selectedGroup) return false;
    const currentUserMember = selectedGroup.members.find((member: { user_id: string; roles: string[] }) => member.user_id === user.$id);
    return currentUserMember?.roles?.includes('admin') || false;
  };

  // Always set mock user groups for testing
  // (Đã dùng mock ở trên, có thể xoá hoặc giữ lại nếu muốn test riêng)
  const handleAddInvoice = () => {
    navigate('/upload-invoice');
  };

  // Fetch statistics when selectedGroupId changes
  React.useEffect(() => {
    if (selectedGroupId) {
      getInvoiceStatistics(selectedGroupId);
    }
  }, [selectedGroupId, getInvoiceStatistics]);

  // Handle adding a new member
  const handleAddMember = (email: string, role: string) => {
    // This would be handled by the MembersSection component
    console.log('Adding member:', { email, role });
    setShowAddMemberModal(false);
  };

  // Example: Display invoice statistics at the top
  // You can style or move this block as needed
  const statsBlock = (
    <div className="mb-4">
      {statsLoading && <div>Đang tải thống kê...</div>}
      {statsError && <div className="text-danger">Lỗi: {statsError}</div>}
      {invoiceStats && (
        <div className="d-flex gap-4">
          <div>Tổng hóa đơn: <strong>{invoiceStats.invoices}</strong></div>
          <div>Tổng sản phẩm: <strong>{invoiceStats.products}</strong></div>
          <div>Tổng cửa hàng: <strong>{invoiceStats.stores}</strong></div>
          <div>Tổng chi tiêu: <strong>{invoiceStats.total_spent?.toLocaleString()} VNĐ</strong></div>
        </div>
      )}
    </div>
  );

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

      {statsBlock}

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
      <StatisticCards />

      <Row className="mb-4">
        <Col lg={8} className="h-200">
          <Card className="shadow-sm h-100">
            <Card.Body>
              {selectedGroupId && (
  <ProductChart group_id={selectedGroupId} />
) }
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="h-200">
          <Card className="shadow-sm h-100">
            <Card.Body>
              {selectedGroupId && (
  <StoreChart group_id={selectedGroupId} />
) }
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Members and Invoices Section - Side by Side */}
      <Row className="g-4">
        {/* Members Section - Left Side */}
        <Col lg={5} xl={4}>
          <Card className="shadow-sm h-100" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
            minHeight: '700px'
        }}>
            {isLoadingGroups ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : selectedGroup ? (
              <MembersSection 
                groupId={selectedGroup.id} 
                isAdmin={isAdmin()} 
              />
            ) : (
              <div className="text-center py-5">
                <p className="text-muted mb-0">Failed to load group data</p>
              </div>
            )}
          </Card>
        </Col>

                
        {/* Invoices Section - Right Side */}
        <Col lg={7} xl={8}>
          <Card className="shadow-sm h-100" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '700px'
          }}>
            <InvoiceList
              groupId={selectedGroupId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Add Member Modal */}
      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="memberEmail" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="memberEmail"
              placeholder="Enter email address"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="memberRole" className="form-label">Role</label>
            <select className="form-select" id="memberRole">
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            const emailInput = document.getElementById('memberEmail') as HTMLInputElement;
            const roleSelect = document.getElementById('memberRole') as HTMLSelectElement;
            handleAddMember(emailInput.value, roleSelect.value);
          }}>
            Add Member
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;

