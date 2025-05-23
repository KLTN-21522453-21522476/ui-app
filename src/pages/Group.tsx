// src/pages/Group.tsx
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { GroupCard } from '../components/layouts/group/GroupCard';
import { useSelector } from 'react-redux';
import { GroupFilters } from '../components/layouts/group/GroupFilters';
import { mockGroupList } from '../mock/mockData';

const GroupPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Ngày tạo');

  // Redux selector for selectedGroupId
  const selectedGroupId = useSelector((state: any) => state.groups.selectedGroupId);

  React.useEffect(() => {
    if (selectedGroupId) {
      console.log('Selected Group ID:', selectedGroupId);
    }
  }, [selectedGroupId]);

  // Filter và sort groups
  const processedGroups = useMemo(() => {
    // Filter groups based on search term
    const filteredGroups = mockGroupList.filter(group =>
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
  }, [searchTerm, sortBy]);

  

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Nhóm</h2>
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
                isAdmin={true}
                onRename={() => {}}
                onDelete={() => {}}
                selectedGroupId={selectedGroupId}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GroupPage;