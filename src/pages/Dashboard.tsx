import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import InvoiceList from '../components/layouts/dashboard/InvoiceList';
import { Box, Typography, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductChart from '../components/layouts/dashboard/ProductChart';
import StoreChart from '../components/layouts/dashboard/StoreChart';
import StatisticCards from '../components/layouts/dashboard/StatisticCards';
import MembersSection from '../components/layouts/dashboard/MembersSection';
import { useInvoice } from '../hooks/useInvoice';
import { fetchGroupDetailsData } from '../redux/slices/groupSlice';
import { useAuth } from '../hooks/useAuth';
import { useStatistic } from '../hooks/useStatistic';
import { ExtractionData } from '../types/FileList';
import { mockGroupList, mockGroupDetails, mockStoreChartData, mockStatisticData } from '../mock/mockData';

// TimeRange type for tracking selected time periods across components
type TimeRange = '7days' | '30days' | '90days' | 'year';

// Group interface for sidebar
interface Group {
  id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    invoices,
    lastFetched,
    getInvoices,
  } = useInvoice();
  const navigate = useNavigate();

  // Statistic hook
  const { invoiceStats, loading: statsLoading, error: statsError, getInvoiceStatistics } = useStatistic();

  // Sidebar state
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupSidebarOpen, setGroupSidebarOpen] = useState(true);
  const [actionsSidebarOpen, setActionsSidebarOpen] = useState(false);

  // Group data state
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  // Dashboard state
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'status'>('date_desc');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    members: Array<{ user_id: string; roles: string[] }>;
  } | null>(null);
  const [isGroupLoading, setIsGroupLoading] = useState(false);

  // Fetch user's groups
  useEffect(() => {
    const fetchUserGroups = async () => {
      setIsLoadingGroups(true);
      try {
        // Replace with your actual API call
        // Example: const response = await groupApi.getUserGroups(user?.$id);
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        // Sử dụng mockGroupList từ mockData
        const groups = mockGroupList.map(g => ({ id: g.id, name: g.name }));
        setUserGroups(groups);
        if (!selectedGroupId && groups.length > 0) {
          setSelectedGroupId(groups[0].id);
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      } finally {
        setIsLoadingGroups(false);
      }
    };
    fetchUserGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.$id]);

  // Fetch selected group details
  useEffect(() => {
    if (!selectedGroupId) return;
    setIsGroupLoading(true);
    const fetchGroupDetails = async () => {
      try {
        // Sử dụng mockGroupDetails từ mockData
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setSelectedGroup({
          id: mockGroupDetails.id,
          members: mockGroupDetails.members || []
        });
        getInvoices(selectedGroupId);
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setIsGroupLoading(false);
      }
    };
    fetchGroupDetails();
  }, [selectedGroupId, getInvoices]);

  // Pagination state for InvoiceList
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // isAdmin function at the top level
  const isAdmin = (): boolean => {
    if (!user || !selectedGroup) return true;
    const currentUserMember = selectedGroup.members.find((member: { user_id: string; roles: string[] }) => member.user_id === user.$id);
    return currentUserMember?.roles?.includes('admin') || false;
  };

  // Always set mock user groups for testing
  // (Đã dùng mock ở trên, có thể xoá hoặc giữ lại nếu muốn test riêng)


  useEffect(() => {
    // Check if data doesn't exist or is older than 5 minutes
    const shouldFetch = 
      !invoices.length || 
      !lastFetched || 
      (Date.now() - lastFetched > 5 * 60 * 1000);
    
    if (shouldFetch && selectedGroup) {
      getInvoices(selectedGroup.id);
    }
  }, [invoices.length, lastFetched, selectedGroup, getInvoices]);

  const handleAddInvoice = () => {
    navigate('/upload-invoice');
  };

  // Pagination handlers for InvoiceList
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  // Add a handler for InvoiceList with the correct signature
  const handleInvoiceListPageChange = (page: number) => {
    setPage(page);
  };
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  // Use invoices from Redux selector
  const filteredInvoices = invoices.filter(invoice => {
    const term = searchTerm.trim().toLowerCase();
    return (
      !term ||
      (invoice.invoice_number && invoice.invoice_number.toLowerCase().includes(term)) ||
      (invoice.store_name && invoice.store_name.toLowerCase().includes(term))
    );
  });


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
              <ProductChart />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="h-200">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <StoreChart />
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
            height: '100%' 
        }}>
            {isGroupLoading ? (
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
            overflow: 'hidden' 
          }}>
            <InvoiceList
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

