// src/pages/Group.tsx
import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMembers } from '../hooks/useMembers';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useGroups } from '../hooks/useGroups';
import AddMemberModal from '../components/modal/AddMemberModal';
import { GroupCard } from '../components/layouts/group/GroupCard';
import { GroupFilters } from '../components/layouts/group/GroupFilters';
import { GroupModals } from '../components/layouts/group/GroupModals';
import { useGroupActions } from '../hooks/useGroupActions';

const GroupPage: React.FC = () => {
  // State for Add Member Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [addMemberGroupId, setAddMemberGroupId] = useState<string | null>(null);

  // Handler to open modal for a group
  const handleShowAddMemberModal = (group: any) => {
    setShowAddMemberModal(true);
    setAddMemberGroupId(group.id);
    setNewMemberEmail('');
    setNewMemberRole('viewer');
    setAddMemberError(null);
  };

  // Add member logic using useMembers hook
  const { addNewMember, leaveGroupByUser } = useMembers(addMemberGroupId);

  // State for Leave Group Modal
  const [leaveModalGroup, setLeaveModalGroup] = useState<any>(null);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);

  // User info via custom auth hook
  const { user } = useAuth();

  const openLeaveModal = (group: any) => setLeaveModalGroup(group);
  const closeLeaveModal = () => setLeaveModalGroup(null);

  const handleLeaveGroup = async () => {
    if (!leaveModalGroup || !user) return;
    setIsLeavingGroup(true);
    try {
      await leaveGroupByUser(leaveModalGroup.id, user.$id);
      closeLeaveModal();
      refetch();
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLeavingGroup(false);
    }
  };

  const handleAddMember = async () => {
    if (!addMemberGroupId || !newMemberEmail.trim()) return;
    setIsAddingMember(true);
    setAddMemberError(null);
    try {
      await addNewMember(newMemberEmail, [newMemberRole]);
      setShowAddMemberModal(false);
    } catch (err: any) {
      setAddMemberError(err?.message || 'Lỗi khi thêm thành viên');
    } finally {
      setIsAddingMember(false);
    }
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Ngày tạo');

  // Group state and handlers
  const {
    selectedGroupId,
    groupList,
    refetch
  } = useGroups();

  // Group modal and handlers
  const {
    modalState,
    openCreateModal,
    closeAllModals,
    openDeleteModal,
    openRenameModal,
    handleDeleteGroup,
    handleCreateGroup,
    handleRenameGroup,
    updateCreateGroupName,
    updateRenameGroupName,
    updateCreateGroupDescription
  } = useGroupActions();

  // Ensure group data is fetched after login or navigation
  React.useEffect(() => {
    if (groupList.length === 0) {
      refetch();
    }
  }, [groupList, refetch]);

  // Process groups with search and sort
  const processedGroups = useMemo(() => {
    return groupList
      .filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
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

  return (
    <>
      <Container fluid className="px-3 px-md-4 py-3 py-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 gap-md-0 mb-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h2 className="mb-0 fs-4 fs-md-2">Nhóm</h2>
            <div className="d-none d-md-block">
              <Button 
                variant="primary" 
                onClick={openCreateModal}
                style={{ width: '160px' }}
              >
                + Tạo nhóm mới
              </Button>
            </div>
          </div>
          <div className="d-md-none w-100 d-grid">
            <Button 
              variant="primary" 
              onClick={openCreateModal}
            >
              + Tạo nhóm mới
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <GroupFilters
            searchTerm={searchTerm}
            sortBy={sortBy}
            onSearchChange={setSearchTerm}
            onSortChange={setSortBy}
          />
        </div>

        {processedGroups.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">Không tìm thấy nhóm nào</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} xxl={4} className="g-3 g-md-4">
            {processedGroups.map(group => (
              <Col key={group.id}>
                <GroupCard 
                  group={group}
                  onRename={group => openRenameModal(group as any)}
                  onDelete={group => openDeleteModal(group as any)}
                  onAddMember={() => handleShowAddMemberModal(group)}
                  onLeave={() => openLeaveModal(group)}
                  selectedGroupId={selectedGroupId}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <GroupModals
        modalState={{
          ...modalState,
          leave: {
            show: !!leaveModalGroup,
            group: leaveModalGroup,
            isProcessing: isLeavingGroup
          }
        }}
        onClose={() => {
          closeAllModals();
          closeLeaveModal();
          refetch();
        }}
        onDelete={handleDeleteGroup}
        onCreate={handleCreateGroup}
        onRename={handleRenameGroup}
        onLeave={handleLeaveGroup}
        onUpdateCreateName={updateCreateGroupName}
        onUpdateRenameName={updateRenameGroupName}
        onUpdateCreateDescription={updateCreateGroupDescription}
      />
      <AddMemberModal
        show={showAddMemberModal}
        onHide={() => setShowAddMemberModal(false)}
        email={newMemberEmail}
        role={newMemberRole}
        onEmailChange={setNewMemberEmail}
        onRoleChange={setNewMemberRole}
        onAdd={handleAddMember}
        isProcessing={isAddingMember}
        error={addMemberError}
      />
    </>
  );
};

export default GroupPage;