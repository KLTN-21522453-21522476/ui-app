// src/pages/Group.tsx
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useGroups } from '../hooks/useGroups';
import { GroupCard } from '../components/layouts/group/GroupCard';
import { GroupFilters } from '../components/layouts/group/GroupFilters';
import { GroupModals } from '../components/layouts/group/GroupModals';
import { useGroupActions } from '../hooks/useGroupActions';

const GroupPage: React.FC = () => {
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
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Nhóm</h2>
          <Button variant="primary" onClick={openCreateModal}>
            + Tạo nhóm mới
          </Button>
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
            {processedGroups.map(group => (
              <Col key={group.id}>
                <GroupCard 
                  group={group}
                  onRename={handleRenameGroup}
                  onDelete={handleDeleteGroup}
                  selectedGroupId={selectedGroupId}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <GroupModals
        modalState={modalState}
        onClose={closeAllModals}
        onDelete={handleDeleteGroup}
        onCreate={handleCreateGroup}
        onRename={handleRenameGroup}
        onUpdateCreateName={updateCreateGroupName}
        onUpdateRenameName={updateRenameGroupName}
        onUpdateCreateDescription={updateCreateGroupDescription}
      />
    </>
  );
};

export default GroupPage;