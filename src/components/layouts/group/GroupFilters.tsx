// src/components/group/GroupFilters.tsx
import React from 'react';
import { InputGroup, Form, Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

interface GroupFiltersProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (term: string) => void;
  onSortChange: (sortOption: string) => void;
}

export const GroupFilters: React.FC<GroupFiltersProps> = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange
}) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <InputGroup style={{ maxWidth: '250px' }}>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Tìm nhóm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
          Sắp xếp theo: {sortBy}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onSortChange('Ngày tạo')}>Ngày tạo</Dropdown.Item>
          <Dropdown.Item onClick={() => onSortChange('Tên')}>Tên</Dropdown.Item>
          <Dropdown.Item onClick={() => onSortChange('Số lượng hoá đơn')}>Số lượng hoá đơn</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};