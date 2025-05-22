import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import InvoiceList from '../components/layouts/dashboard/InvoiceList';
import ProductChart from '../components/layouts/dashboard/ProductChart';
import StoreChart from '../components/layouts/dashboard/StoreChart';
import StatisticCards from '../components/layouts/dashboard/StatisticCards';
import MembersSection from '../components/layouts/dashboard/MembersSection';
import GroupSidebar from '../components/layouts/GroupSidebar';
import GroupActionsSidebar from '../components/layouts/GroupActionsSidebar';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchInvoiceList } from '../redux/slices/invoiceSlice';
import { fetchGroupDetailsData } from '../redux/slices/groupSlice';
import { useAuth } from '../hooks/useAuth';
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
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { invoiceList: { items: invoices }, isLoading, lastFetched } = useAppSelector((state) => state.invoices);
  const navigate = useNavigate();

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
        dispatch(fetchInvoiceList(selectedGroupId));
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setIsGroupLoading(false);
      }
    };
    fetchGroupDetails();
  }, [selectedGroupId, dispatch]);

  // isAdmin function at the top level
  const isAdmin = (): boolean => {
    if (!user || !selectedGroup) return false;
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
      dispatch(fetchInvoiceList(selectedGroup.id));
    }
  }, [dispatch, invoices.length, lastFetched, selectedGroup]);

  const handleAddInvoice = () => {
    navigate('/upload-invoice');
  };

  // Handle adding a new member
  const handleAddMember = (email: string, role: string) => {
    // This would be handled by the MembersSection component
    console.log('Adding member:', { email, role });
    setShowAddMemberModal(false);
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
      <StatisticCards data={mockStatisticData} />

      <Row className="mb-4">
        <Col lg={8}>
          {/* Remove the card wrapper since ProductChart now already has its own card wrapper */}
          <ProductChart />
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Biểu đồ các cửa hàng</h5>
            </Card.Header>
            <Card.Body>
              <StoreChart data={mockStoreChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Members and Invoices Section - Side by Side */}
      <Row className="g-4">
        {/* Members Section - Left Side */}
        <Col lg={5} xl={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Team Members</h5>
              {isAdmin() && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <FaPlus className="me-1" /> Add Member
                </Button>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              {isGroupLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : selectedGroup ? (
                <div className="p-3">
                  <div className="mb-3">
                    <div className="position-relative">
                      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <MembersSection 
                      groupId={selectedGroup.id} 
                      isAdmin={isAdmin()} 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">Failed to load group data</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Invoices Section - Right Side */}
        <Col lg={7} xl={8}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Recent Invoices</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <InvoiceList 
                  invoices={invoices.map(invoice => ({
                    model: '',
                    address: '',
                    fileName: invoice.invoice_number || '',
                    storeName: invoice.store_name || '',
                    createdDate: invoice.created_date || '',
                    id: invoice.id || '',
                    status: invoice.status || 'pending',
                    approvedBy: '',
                    submittedBy: '',
                    updateAt: invoice.created_date || '',
                    items: [],
                    totalAmount: invoice.total_amount || 0
                  } as ExtractionData))}
                  isLoading={isLoading} 
                />
              </div>
            </Card.Body>
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
