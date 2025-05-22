// src/pages/Group.tsx
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { GroupFilters } from '../components/layouts/group/GroupFilters';
import { mockGroupList } from '../mock/mockData';

const GroupPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Ngày tạo');

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
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{group.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Ngày tạo: {new Date(group.created_date).toLocaleDateString()}</Card.Subtitle>
                  <Card.Text>{group.description}</Card.Text>
                  <div className="fw-bold">Số lượng hoá đơn: {group.invoice_count}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default GroupPage;