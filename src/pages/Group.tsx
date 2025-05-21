// src/pages/Group.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchGroupListData } from '../redux/slices/groupSlice';
import { GroupCard } from '../components/layouts/group/GroupCard';
import { GroupModals } from '../components/layouts/group/GroupModals';
import { GroupFilters } from '../components/layouts/group/GroupFilters';
import { useGroupActions } from '../hooks/useGroupActions';

const GroupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { groupList, isLoading, error } = useAppSelector((state) => state.groups);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Ngày tạo');
  const { user, isInitialized } = useAuth();
  
  const { 
    modalState, 
    openDeleteModal, 
    openCreateModal, 
    openRenameModal, 
    closeAllModals,
    handleDeleteGroup,
    handleCreateGroup,
    handleRenameGroup,
    updateCreateGroupName,
    updateRenameGroupName
  } = useGroupActions();

  useEffect(() => {
    if (isInitialized && user) {
      dispatch(fetchGroupListData());
    }
  }, [dispatch, isInitialized, user]);

  // Kiểm tra người dùng có phải là admin của group hay không
  const isGroupAdmin = (groupId: string): boolean => {
    if (!user) return false;
    
    // Lấy group details từ Redux store
    const groupDetails = useAppSelector((state) => state.groups.groupDetails[groupId]);
    if (!groupDetails) return false;
    
    // Kiểm tra xem người dùng hiện tại có phải là người tạo group không
    if (groupDetails.created_by === user.$id) return true;
    
    // Tìm member hiện tại trong danh sách members
    const currentMember = groupDetails.members.find(member => member.user_id === user.$id);
    
    // Kiểm tra xem member có role admin không
    return currentMember?.roles.includes('admin') || false;
  };
  

  // Filter và sort groups
  const processedGroups = useMemo(() => {
    // Filter groups based on search term
    const filteredGroups = groupList.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort groups based on selected option
    return [...filteredGroups].sort((a, b) => {
      switch (sortBy) {
        case 'Tên':
          return a.name.localeCompare(b.name);
        case 'Số lượng hoá đơn':
          return b.invoice_count - a.invoice_count;
        case 'Ngày tạo':
        default:
          if (!a.created_date && !b.created_date) return 0;
          if (!a.created_date) return 1;
          if (!b.created_date) return -1;
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
      }
    });
  }, [groupList, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          Error loading groups: {error}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <GroupModals 
        modalState={modalState}
        onClose={closeAllModals}
        onDelete={handleDeleteGroup}
        onCreate={handleCreateGroup}
        onRename={handleRenameGroup}
        onUpdateCreateName={updateCreateGroupName}
        onUpdateRenameName={updateRenameGroupName}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Nhóm</h2>
        <div className="d-flex">
          <Button 
            variant="primary"
            onClick={openCreateModal}
          >
            <FaPlus className="me-1" /> Tạo nhóm mới
          </Button>
        </div>
      </div>

      <GroupFilters 
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
      />

      {processedGroups.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Không tìm thấy nhóm nào</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {processedGroups.map((group) => (
            <Col key={group.id}>
              <GroupCard 
                groupId={group.id}
                isAdmin={isGroupAdmin(group.id)}
                onRename={(groupDetails) => openRenameModal(groupDetails)}
                onDelete={(groupDetails) => openDeleteModal(groupDetails)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GroupPage;